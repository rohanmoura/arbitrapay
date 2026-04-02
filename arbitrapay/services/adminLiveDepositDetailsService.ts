import { supabase } from "@/lib/supabase";

type ProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: "user" | "admin" | null;
};

type BankAccountRow = {
  id: string;
  bank_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
};

type ActivationRow = {
  id: string;
  user_id: string | null;
  bank_account_id: string | null;
  account_number: string;
  ifsc_code: string;
  status: "pending" | "approved" | "rejected" | null;
  created_at: string | null;
  profiles: ProfileRow | ProfileRow[] | null;
  bank_accounts: BankAccountRow | BankAccountRow[] | null;
};

type SecurityDepositRow = {
  amount: number | string | null;
};

type LiveDepositRow = {
  id: string;
  user_id: string;
  bank_account_id: string | null;
  amount: number | string | null;
  type: "credit" | "debit" | string;
  status: string | null;
  description: string | null;
  created_at: string | null;
};

export type AdminLiveDepositTransactionType = "credit" | "debit";

export type AdminLiveDepositDetails = {
  requestId: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
  };
  bankAccount: {
    id: string | null;
    bankName: string | null;
    accountHolderName: string | null;
    accountNumber: string;
    ifscCode: string;
  };
  activation: {
    createdAt: string | null;
    status: "approved";
  };
  totalSecurityDepositAmount: number;
  history: AdminLiveDepositHistoryItem[];
};

export type AdminLiveDepositHistoryItem = {
  id: string;
  amount: number;
  type: AdminLiveDepositTransactionType;
  status: string | null;
  description: string | null;
  createdAt: string | null;
};

function getSingleRow<T>(value: T | T[] | null) {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] || null : value;
}

function mapHistoryItem(row: LiveDepositRow): AdminLiveDepositHistoryItem {
  return {
    id: row.id,
    amount: Number(row.amount || 0),
    type: row.type === "debit" ? "debit" : "credit",
    status: row.status,
    description: row.description,
    createdAt: row.created_at,
  };
}

export async function fetchAdminLiveDepositDetails(requestId: string) {
  const { data: activationData, error: activationError } = await supabase
    .from("account_activations")
    .select(`
      id,
      user_id,
      bank_account_id,
      account_number,
      ifsc_code,
      status,
      created_at,
      profiles!account_activations_user_id_fkey (
        id,
        email,
        name,
        avatar,
        role
      ),
      bank_accounts (
        id,
        bank_name,
        account_holder_name,
        account_number,
        ifsc_code
      )
    `)
    .eq("id", requestId)
    .eq("status", "approved")
    .maybeSingle();

  if (activationError) {
    throw activationError;
  }

  const activation = activationData as ActivationRow | null;

  if (!activation) {
    return null;
  }

  const profile = getSingleRow(activation.profiles);
  const bankAccount = getSingleRow(activation.bank_accounts);

  if (!activation.user_id || !profile || profile.role !== "user") {
    return null;
  }

  const [{ data: depositsData, error: depositsError }, { data: historyData, error: historyError }] =
    await Promise.all([
      supabase
        .from("security_deposits")
        .select("amount")
        .eq("user_id", activation.user_id),
      supabase
        .from("live_deposits")
        .select("id, user_id, bank_account_id, amount, type, status, description, created_at")
        .eq("user_id", activation.user_id)
        .eq("bank_account_id", activation.bank_account_id)
        .order("created_at", { ascending: false }),
    ]);

  if (depositsError) {
    throw depositsError;
  }

  if (historyError) {
    throw historyError;
  }

  const totalSecurityDepositAmount = ((depositsData || []) as SecurityDepositRow[]).reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return {
    requestId: activation.id,
    user: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
    },
    bankAccount: {
      id: activation.bank_account_id,
      bankName: bankAccount?.bank_name || null,
      accountHolderName: bankAccount?.account_holder_name || profile.name,
      accountNumber: bankAccount?.account_number || activation.account_number,
      ifscCode: bankAccount?.ifsc_code || activation.ifsc_code,
    },
    activation: {
      createdAt: activation.created_at,
      status: "approved",
    },
    totalSecurityDepositAmount,
    history: ((historyData || []) as LiveDepositRow[]).map(mapHistoryItem),
  } satisfies AdminLiveDepositDetails;
}

export async function fetchAdminLiveDepositDetailsByUserId(userId: string) {
  const { data, error } = await supabase
    .from("account_activations")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data?.id) {
    return null;
  }

  return fetchAdminLiveDepositDetails(data.id);
}

export async function createLiveDeposit(input: {
  userId: string;
  bankAccountId?: string | null;
  type: AdminLiveDepositTransactionType;
  amount: number;
  createdBy?: string | null;
}) {
  const { data, error } = await supabase
    .from("live_deposits")
    .insert({
      user_id: input.userId,
      bank_account_id: input.bankAccountId || null,
      amount: input.amount,
      type: input.type,
      status: "approved",
      created_by: input.createdBy || null,
      approved_by: input.createdBy || null,
      approved_at: new Date().toISOString(),
    })
    .select("id, user_id, bank_account_id, amount, type, status, description, created_at")
    .single();

  if (error) {
    throw error;
  }

  return mapHistoryItem(data as LiveDepositRow);
}
