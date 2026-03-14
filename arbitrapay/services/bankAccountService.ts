import { supabase } from "@/lib/supabase";

export type BankAccountRecord = {
  id: string;
  user_id: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  is_verified: boolean | null;
  is_default: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CreateBankAccountInput = {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
};

export function sortBankAccounts(accounts: BankAccountRecord[]) {
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

export async function fetchBankAccounts(userId: string) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select(
      "id, user_id, account_holder_name, account_number, ifsc_code, bank_name, is_verified, is_default, created_at, updated_at"
    )
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return sortBankAccounts((data || []) as BankAccountRecord[]);
}

export async function createBankAccount(
  userId: string,
  input: CreateBankAccountInput,
  isDefault: boolean
) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("bank_accounts")
    .insert({
      user_id: userId,
      account_holder_name: input.accountHolderName,
      account_number: input.accountNumber,
      ifsc_code: input.ifscCode,
      bank_name: input.bankName,
      is_default: isDefault,
      is_verified: false,
      updated_at: now,
    })
    .select(
      "id, user_id, account_holder_name, account_number, ifsc_code, bank_name, is_verified, is_default, created_at, updated_at"
    )
    .single();

  if (error) {
    if (error.message.includes("bank_accounts_user_id_account_number_key")) {
      throw new Error("This bank account is already added.");
    }

    throw error;
  }

  return data as BankAccountRecord;
}

export async function setPrimaryBankAccount(userId: string, accountId: string) {
  const timestamp = new Date().toISOString();

  const { error: unsetError } = await supabase
    .from("bank_accounts")
    .update({
      is_default: false,
      updated_at: timestamp,
    })
    .eq("user_id", userId)
    .neq("id", accountId);

  if (unsetError) {
    throw unsetError;
  }

  const { data, error } = await supabase
    .from("bank_accounts")
    .update({
      is_default: true,
      updated_at: timestamp,
    })
    .eq("user_id", userId)
    .eq("id", accountId)
    .select(
      "id, user_id, account_holder_name, account_number, ifsc_code, bank_name, is_verified, is_default, created_at, updated_at"
    )
    .single();

  if (error) {
    throw error;
  }

  return data as BankAccountRecord;
}

export async function deleteBankAccount(userId: string, accountId: string) {
  const { error } = await supabase
    .from("bank_accounts")
    .delete()
    .eq("user_id", userId)
    .eq("id", accountId);

  if (error) {
    throw error;
  }
}
