import { supabase } from "@/lib/supabase";

type BankAccountProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  status: string | null;
  role: "user" | "admin" | null;
};

type RawBankAccountRow = {
  id: string;
  user_id: string | null;
  account_holder_name: string;
  account_number: string;
  created_at: string | null;
  profiles: BankAccountProfileRow | BankAccountProfileRow[] | null;
};

export type AdminBankAccountRecord = {
  id: string;
  userId: string;
  accountHolderName: string;
  accountNumber: string;
  createdAt: string | null;
  user: {
    id: string;
    email: string | null;
    name: string | null;
    avatar: string | null;
    status: string | null;
  };
  activated: boolean;
};

export type AdminBankAccountsSummary = {
  totalBankAccounts: number;
  activatedBankAccounts: number;
};

function getProfileRow(profile: RawBankAccountRow["profiles"]) {
  if (!profile) {
    return null;
  }

  return Array.isArray(profile) ? profile[0] || null : profile;
}

function sortByEmail(
  accounts: AdminBankAccountRecord[],
  sort: "A-Z" | "Z-A"
) {
  return [...accounts].sort((left, right) => {
    const leftEmail = left.user.email?.toLowerCase() || "";
    const rightEmail = right.user.email?.toLowerCase() || "";
    const emailComparison = leftEmail.localeCompare(rightEmail);

    if (emailComparison !== 0) {
      return sort === "A-Z" ? emailComparison : -emailComparison;
    }

    const leftCreated = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    const rightCreated = right.createdAt ? new Date(right.createdAt).getTime() : 0;

    return rightCreated - leftCreated;
  });
}

export async function fetchAdminBankAccountsData() {
  const [bankAccountsResponse, activationsResponse] = await Promise.all([
    supabase.from("bank_accounts").select(`
        id,
        user_id,
        account_holder_name,
        account_number,
        created_at,
        profiles!inner (
          id,
          email,
          name,
          avatar,
          status,
          role
        )
      `),
    supabase
      .from("account_activations")
      .select("bank_account_id")
      .eq("status", "approved"),
  ]);

  if (bankAccountsResponse.error) {
    throw bankAccountsResponse.error;
  }

  if (activationsResponse.error) {
    throw activationsResponse.error;
  }

  const approvedAccountIds = new Set(
    (activationsResponse.data || [])
      .map((row) => row.bank_account_id)
      .filter(Boolean)
  );

  const accounts = ((bankAccountsResponse.data || []) as RawBankAccountRow[])
    .map((row) => {
      const profile = getProfileRow(row.profiles);

      if (!row.user_id || !profile || profile.role !== "user") {
        return null;
      }

      return {
        id: row.id,
        userId: row.user_id,
        accountHolderName: row.account_holder_name,
        accountNumber: row.account_number,
        createdAt: row.created_at,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar,
          status: profile.status,
        },
        activated: approvedAccountIds.has(row.id),
      } satisfies AdminBankAccountRecord;
    })
    .filter(Boolean) as AdminBankAccountRecord[];

  return {
    accounts,
    summary: {
      totalBankAccounts: accounts.length,
      activatedBankAccounts: accounts.filter((account) => account.activated).length,
    } satisfies AdminBankAccountsSummary,
    sortByEmail,
  };
}
