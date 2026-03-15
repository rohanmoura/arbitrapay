import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "@/lib/supabase";

type SecurityDepositRow = {
  id: string;
  amount: number;
  status: string | null;
  bank_account_id: string | null;
  created_at: string | null;
};

type WithdrawalRow = {
  id: string;
  amount: number;
  status: string | null;
  bank_account_id: string | null;
  created_at: string | null;
};

type LiveDepositRow = {
  id: string;
  amount: number;
  status: string | null;
  type: string | null;
  bank_account_id: string | null;
  created_at: string | null;
};

type BankAccountRow = {
  id: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
};

type AccountActivationRow = {
  id: string;
  status: string | null;
  bank_account_id: string;
};

type TransactionRow = {
  id: string;
  type: string;
  amount: number;
  status: string | null;
  reference_id: string | null;
  description: string | null;
  created_at: string | null;
};

export type TransactionFilter = "All" | "Deposits" | "Withdrawals";

export type PaymentHistorySummary = {
  totalDeposits: number;
  totalWithdrawals: number;
  pendingTransactions: number;
  currentBalance: number;
  pendingWithdrawals: number;
  totalBankAccounts: number;
  verifiedBankAccounts: number;
};

export type PaymentHistoryItem = {
  id: string;
  transactionId: string;
  type: "security_deposit" | "live_deposit" | "withdrawal" | "referral_bonus";
  amount: number;
  statusLabel: "Approved" | "Pending" | "Rejected";
  directionLabel: "Deposit" | "Withdrawal";
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  createdAt: string | null;
  description: string | null;
  liveDepositKind: "credit" | "debit" | null;
};

const TRANSACTION_LAST_SEEN_KEY_PREFIX = "payment_history_last_seen";

function normalizeStatus(status: string | null | undefined) {
  const normalized = status?.toLowerCase();

  if (!normalized) {
    return "approved";
  }

  if (normalized === "completed" || normalized === "approved") {
    return "approved";
  }

  if (normalized === "failed" || normalized === "rejected") {
    return "rejected";
  }

  return "pending";
}

function statusLabelFromNormalized(status: string) {
  if (status === "approved") {
    return "Approved" as const;
  }

  if (status === "rejected") {
    return "Rejected" as const;
  }

  return "Pending" as const;
}

function isPositiveLiveDepositType(type: string | null | undefined) {
  return (type || "").toLowerCase() !== "debit";
}

function numberValue(value: number | null | undefined) {
  return Number(value || 0);
}

function buildSeenKey(userId: string) {
  return `${TRANSACTION_LAST_SEEN_KEY_PREFIX}:${userId}`;
}

async function fetchUserTransactions(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("id, type, amount, status, reference_id, description, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []) as TransactionRow[];
}

async function fetchSecurityDeposits(userId: string) {
  const { data, error } = await supabase
    .from("security_deposits")
    .select("id, amount, status, bank_account_id, created_at")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data || []) as SecurityDepositRow[];
}

async function fetchWithdrawals(userId: string) {
  const { data, error } = await supabase
    .from("withdrawals")
    .select("id, amount, status, bank_account_id, created_at")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data || []) as WithdrawalRow[];
}

async function fetchLiveDeposits(userId: string) {
  const { data, error } = await supabase
    .from("live_deposits")
    .select("id, amount, status, type, bank_account_id, created_at")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data || []) as LiveDepositRow[];
}

async function fetchBankAccounts(userId: string) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("id, account_holder_name, account_number, ifsc_code, bank_name")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data || []) as BankAccountRow[];
}

async function fetchAccountActivations(userId: string) {
  const { data, error } = await supabase
    .from("account_activations")
    .select("id, status, bank_account_id")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data || []) as AccountActivationRow[];
}

export async function fetchPaymentHistoryData(userId: string) {
  const [
    transactions,
    securityDeposits,
    withdrawals,
    liveDeposits,
    bankAccounts,
    accountActivations,
  ] = await Promise.all([
    fetchUserTransactions(userId),
    fetchSecurityDeposits(userId),
    fetchWithdrawals(userId),
    fetchLiveDeposits(userId),
    fetchBankAccounts(userId),
    fetchAccountActivations(userId),
  ]);

  const bankLookup = new Map(bankAccounts.map((bank) => [bank.id, bank]));
  const securityLookup = new Map(securityDeposits.map((row) => [row.id, row]));
  const withdrawalLookup = new Map(withdrawals.map((row) => [row.id, row]));
  const liveDepositLookup = new Map(liveDeposits.map((row) => [row.id, row]));

  const summary: PaymentHistorySummary = {
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingTransactions: 0,
    currentBalance: 0,
    pendingWithdrawals: 0,
    totalBankAccounts: bankAccounts.length,
    verifiedBankAccounts: new Set(
      accountActivations
        .filter((activation) => normalizeStatus(activation.status) === "approved")
        .map((activation) => activation.bank_account_id)
    ).size,
  };

  securityDeposits.forEach((deposit) => {
    const normalizedStatus = normalizeStatus(deposit.status);
    const amount = numberValue(deposit.amount);

    if (normalizedStatus === "approved") {
      summary.totalDeposits += amount;
      summary.currentBalance += amount;
    }

    if (normalizedStatus === "pending") {
      summary.pendingTransactions += amount;
    }
  });

  withdrawals.forEach((withdrawal) => {
    const normalizedStatus = normalizeStatus(withdrawal.status);
    const amount = numberValue(withdrawal.amount);

    if (normalizedStatus === "approved") {
      summary.totalWithdrawals += amount;
      summary.currentBalance -= amount;
    }

    if (normalizedStatus === "pending") {
      summary.pendingTransactions += amount;
      summary.pendingWithdrawals += amount;
    }
  });

  liveDeposits.forEach((liveDeposit) => {
    const normalizedStatus = normalizeStatus(liveDeposit.status);
    const amount = numberValue(liveDeposit.amount);
    const isCredit = isPositiveLiveDepositType(liveDeposit.type);

    if (normalizedStatus === "approved") {
      if (isCredit) {
        summary.totalDeposits += amount;
        summary.currentBalance += amount;
      } else {
        summary.totalWithdrawals += amount;
        summary.currentBalance -= amount;
      }
    }

    if (normalizedStatus === "pending") {
      summary.pendingTransactions += amount;
    }
  });

  const items: PaymentHistoryItem[] = transactions.map((transaction) => {
    const transactionId = transaction.reference_id || transaction.id;
    let bankAccountId: string | null = null;
    let directionLabel: "Deposit" | "Withdrawal" = "Deposit";
    let liveDepositKind: "credit" | "debit" | null = null;

    if (transaction.type === "security_deposit") {
      const deposit = transaction.reference_id
        ? securityLookup.get(transaction.reference_id)
        : undefined;
      bankAccountId = deposit?.bank_account_id || null;
      directionLabel = "Deposit";
    }

    if (transaction.type === "withdrawal") {
      const withdrawal = transaction.reference_id
        ? withdrawalLookup.get(transaction.reference_id)
        : undefined;
      bankAccountId = withdrawal?.bank_account_id || null;
      directionLabel = "Withdrawal";
    }

    if (transaction.type === "live_deposit") {
      const liveDeposit = transaction.reference_id
        ? liveDepositLookup.get(transaction.reference_id)
        : undefined;
      bankAccountId = liveDeposit?.bank_account_id || null;
      const isCredit = isPositiveLiveDepositType(liveDeposit?.type);
      liveDepositKind = isCredit ? "credit" : "debit";
      directionLabel = isCredit ? "Deposit" : "Withdrawal";
    }

    const bankAccount = bankAccountId ? bankLookup.get(bankAccountId) : undefined;

    return {
      id: transaction.id,
      transactionId,
      type: transaction.type as PaymentHistoryItem["type"],
      amount: numberValue(transaction.amount),
      statusLabel: statusLabelFromNormalized(normalizeStatus(transaction.status)),
      directionLabel,
      bankName: bankAccount?.bank_name || "ArbitraPay Wallet",
      accountNumber: bankAccount?.account_number || "",
      ifscCode: bankAccount?.ifsc_code || "—",
      accountHolderName: bankAccount?.account_holder_name || "ArbitraPay User",
      createdAt: transaction.created_at,
      description: transaction.description,
      liveDepositKind,
    };
  });

  return {
    summary,
    items,
  };
}

export async function getUnreadTransactionState(userId: string) {
  const seenKey = buildSeenKey(userId);
  const lastSeen = await AsyncStorage.getItem(seenKey);

  const { data, error } = await supabase
    .from("transactions")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data?.created_at) {
    return false;
  }

  if (!lastSeen) {
    return true;
  }

  return new Date(data.created_at).getTime() > new Date(lastSeen).getTime();
}

export async function markTransactionsSeen(userId: string) {
  await AsyncStorage.setItem(buildSeenKey(userId), new Date().toISOString());
}
