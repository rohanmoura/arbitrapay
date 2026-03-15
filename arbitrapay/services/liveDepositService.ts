import { supabase } from "@/lib/supabase";

type AccountActivationRow = {
  bank_account_id: string;
  account_number: string;
  ifsc_code: string;
  created_at: string | null;
};

type BankAccountRow = {
  id: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
};

export type ApprovedLiveDepositAccount = {
  bankAccountId: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  createdAt: string | null;
};

export type LiveDepositRecord = {
  id: string;
  bank_account_id: string;
  amount: number;
  type: string;
  status: string | null;
  description: string | null;
  created_at: string | null;
};

export async function fetchApprovedLiveDepositAccounts(userId: string) {
  const { data: activationRows, error: activationError } = await supabase
    .from("account_activations")
    .select("bank_account_id, account_number, ifsc_code, created_at")
    .eq("user_id", userId)
    .eq("status", "approved");

  if (activationError) {
    throw activationError;
  }

  const approvedActivations = (activationRows || []) as AccountActivationRow[];

  if (approvedActivations.length === 0) {
    return [];
  }

  const uniqueBankAccountIds = [...new Set(approvedActivations.map((row) => row.bank_account_id))];

  const { data: bankRows, error: bankError } = await supabase
    .from("bank_accounts")
    .select("id, bank_name, account_holder_name, account_number, ifsc_code")
    .in("id", uniqueBankAccountIds);

  if (bankError) {
    throw bankError;
  }

  const bankLookup = new Map(
    ((bankRows || []) as BankAccountRow[]).map((bankRow) => [bankRow.id, bankRow])
  );

  return approvedActivations
    .map((activationRow) => {
      const bankRow = bankLookup.get(activationRow.bank_account_id);

      return {
        bankAccountId: activationRow.bank_account_id,
        bankName: bankRow?.bank_name || "Bank Account",
        accountHolderName: bankRow?.account_holder_name || "Account Holder",
        accountNumber: bankRow?.account_number || activationRow.account_number,
        ifscCode: bankRow?.ifsc_code || activationRow.ifsc_code,
        createdAt: activationRow.created_at,
      };
    })
    .filter(
      (account, index, accounts) =>
        accounts.findIndex(
          (candidate) => candidate.bankAccountId === account.bankAccountId
        ) === index
    )
    .sort((left, right) => {
      const leftCreated = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightCreated = right.createdAt ? new Date(right.createdAt).getTime() : 0;

      return leftCreated - rightCreated;
    });
}

export async function fetchLiveDeposits(userId: string, bankAccountId: string) {
  const { data, error } = await supabase
    .from("live_deposits")
    .select("id, bank_account_id, amount, type, status, description, created_at")
    .eq("user_id", userId)
    .eq("bank_account_id", bankAccountId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []) as LiveDepositRecord[];
}
