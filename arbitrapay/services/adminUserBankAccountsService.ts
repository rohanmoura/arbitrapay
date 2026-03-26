import { supabase } from "@/lib/supabase";

export type AdminUserBankAccountItem = {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  totalDeposits: number;
  isActivated: boolean;
  isVerified: boolean;
};

export type AdminUserBankAccountsResponse = {
  user: {
    id: string;
    avatar: string | null;
    email: string;
    name: string | null;
  };
  totalAccounts: number;
  primaryAccount: AdminUserBankAccountItem | null;
  otherAccounts: AdminUserBankAccountItem[];
};

type UserProfileRow = {
  id: string;
  avatar: string | null;
  email: string | null;
  name: string | null;
};

type BankAccountRow = {
  id: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  is_default: boolean | null;
  created_at: string | null;
};

type SecurityDepositRow = {
  bank_account_id: string | null;
  amount: number | string | null;
};

type ActivationRow = {
  bank_account_id: string | null;
};

function addDepositAmount(
  totals: Map<string, number>,
  bankAccountId: string | null,
  amount: number | string | null
) {
  if (!bankAccountId) {
    return;
  }

  totals.set(bankAccountId, (totals.get(bankAccountId) || 0) + Number(amount || 0));
}

function sortBankAccounts(accounts: BankAccountRow[]) {
  return [...accounts].sort((left, right) => {
    const leftPrimary = Boolean(left.is_default);
    const rightPrimary = Boolean(right.is_default);

    if (leftPrimary !== rightPrimary) {
      return leftPrimary ? -1 : 1;
    }

    const leftCreated = left.created_at ? new Date(left.created_at).getTime() : 0;
    const rightCreated = right.created_at ? new Date(right.created_at).getTime() : 0;

    if (leftCreated !== rightCreated) {
      return leftCreated - rightCreated;
    }

    return left.id.localeCompare(right.id);
  });
}

export async function fetchAdminUserBankAccounts(userId: string) {
  const [
    profileResponse,
    bankAccountsResponse,
    securityDepositsResponse,
    activationsResponse,
  ] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, avatar, email, name")
        .eq("id", userId)
        .eq("role", "user")
        .maybeSingle(),
      supabase
        .from("bank_accounts")
        .select(
          "id, bank_name, account_holder_name, account_number, ifsc_code, is_default, created_at"
        )
        .eq("user_id", userId),
      supabase
        .from("security_deposits")
        .select("bank_account_id, amount")
        .eq("user_id", userId),
      supabase
        .from("account_activations")
        .select("bank_account_id")
        .eq("user_id", userId)
        .eq("status", "approved"),
    ]);

  if (profileResponse.error) {
    throw profileResponse.error;
  }

  if (bankAccountsResponse.error) {
    throw bankAccountsResponse.error;
  }

  if (securityDepositsResponse.error) {
    throw securityDepositsResponse.error;
  }

  if (activationsResponse.error) {
    throw activationsResponse.error;
  }

  const profile = profileResponse.data as UserProfileRow | null;

  if (!profile?.email) {
    return null;
  }

  const bankAccounts = sortBankAccounts((bankAccountsResponse.data || []) as BankAccountRow[]);
  const totalDepositsByAccount = new Map<string, number>();

  ((securityDepositsResponse.data || []) as SecurityDepositRow[]).forEach((deposit) => {
    addDepositAmount(totalDepositsByAccount, deposit.bank_account_id, deposit.amount);
  });

  const approvedAccountIds = new Set(
    ((activationsResponse.data || []) as ActivationRow[])
      .map((row) => row.bank_account_id)
      .filter(Boolean)
  );
  const mappedAccounts = bankAccounts.map((account) => ({
    id: account.id,
    bankName: account.bank_name,
    accountHolderName: account.account_holder_name,
    accountNumber: account.account_number,
    ifscCode: account.ifsc_code,
    totalDeposits: totalDepositsByAccount.get(account.id) || 0,
    isActivated: approvedAccountIds.has(account.id),
    isVerified: true,
  })) satisfies AdminUserBankAccountItem[];
  const primaryAccount = mappedAccounts.find((account, index) =>
    bankAccounts[index]?.is_default
  ) || mappedAccounts[0] || null;
  const otherAccounts = primaryAccount
    ? mappedAccounts.filter((account) => account.id !== primaryAccount.id)
    : [];

  return {
    user: {
      id: profile.id,
      avatar: profile.avatar,
      email: profile.email,
      name: profile.name,
    },
    totalAccounts: mappedAccounts.length,
    primaryAccount,
    otherAccounts,
  } satisfies AdminUserBankAccountsResponse;
}
