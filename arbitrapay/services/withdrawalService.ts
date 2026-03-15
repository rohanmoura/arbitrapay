import {
  fetchBankAccounts,
  setPrimaryBankAccount,
  type BankAccountRecord,
} from "@/services/bankAccountService";
import { supabase } from "@/lib/supabase";

export type WithdrawalBankAccount = BankAccountRecord;

export async function fetchWithdrawalBankAccounts(userId: string) {
  return fetchBankAccounts(userId);
}

export async function makeWithdrawalBankAccountPrimary(
  userId: string,
  bankAccountId: string
) {
  return setPrimaryBankAccount(userId, bankAccountId);
}

export async function createWithdrawalRequest(input: {
  userId: string;
  bankAccountId: string;
  amount: number;
}) {
  const { data, error } = await supabase
    .from("withdrawals")
    .insert({
      user_id: input.userId,
      bank_account_id: input.bankAccountId,
      amount: input.amount,
      status: "pending",
    })
    .select("id, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
