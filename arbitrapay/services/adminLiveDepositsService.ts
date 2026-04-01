import { supabase } from "@/lib/supabase";

type LiveDepositProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: "user" | "admin" | null;
};

type LiveDepositBankAccountRow = {
  id: string;
  account_holder_name: string | null;
};

type RawApprovedActivationRow = {
  id: string;
  user_id: string | null;
  account_number: string;
  created_at: string | null;
  status: "approved" | "pending" | "rejected" | null;
  profiles: LiveDepositProfileRow | LiveDepositProfileRow[] | null;
  bank_accounts: LiveDepositBankAccountRow | LiveDepositBankAccountRow[] | null;
};

export type AdminLiveDepositRecord = {
  id: string;
  userId: string;
  accountHolderName: string | null;
  accountNumber: string;
  createdAt: string | null;
  status: "approved";
  user: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
  };
};

function getSingleRow<T>(value: T | T[] | null) {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] || null : value;
}

function sortByCreatedAtDesc(records: AdminLiveDepositRecord[]) {
  return [...records].sort((left, right) => {
    const leftCreated = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    const rightCreated = right.createdAt ? new Date(right.createdAt).getTime() : 0;

    return rightCreated - leftCreated;
  });
}

export async function fetchAdminLiveDeposits() {
  const { data, error } = await supabase
    .from("account_activations")
    .select(`
      id,
      user_id,
      account_number,
      created_at,
      status,
      profiles!account_activations_user_id_fkey (
        id,
        email,
        name,
        avatar,
        role
      ),
      bank_accounts (
        id,
        account_holder_name
      )
    `)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const mappedRecords = ((data || []) as RawApprovedActivationRow[])
    .map((row) => {
      const profile = getSingleRow(row.profiles);
      const bankAccount = getSingleRow(row.bank_accounts);

      if (!row.user_id || !profile || profile.role !== "user") {
        return null;
      }

      return {
        id: row.id,
        userId: row.user_id,
        accountHolderName: bankAccount?.account_holder_name || profile.name,
        accountNumber: row.account_number,
        createdAt: row.created_at,
        status: "approved",
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        },
      } satisfies AdminLiveDepositRecord;
    })
    .filter(Boolean) as AdminLiveDepositRecord[];

  const requests = sortByCreatedAtDesc(mappedRecords);

  return {
    requests,
    totalActivatedAccounts: requests.length,
  };
}
