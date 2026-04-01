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
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
};

type LiveDepositRow = {
  id: string;
  user_id: string | null;
  bank_account_id: string | null;
  amount: number | string | null;
  type: "credit" | "debit" | string;
  status: string | null;
  description: string | null;
  created_at: string | null;
  profiles: ProfileRow | ProfileRow[] | null;
  bank_accounts: BankAccountRow | BankAccountRow[] | null;
};

type ActivationMapRow = {
  id: string;
  user_id: string | null;
  bank_account_id: string | null;
  created_at: string | null;
};

export type AdminLiveDepositHistoryRecord = {
  id: string;
  requestId: string | null;
  userId: string;
  amount: number;
  type: "credit" | "debit";
  status: string | null;
  description: string | null;
  createdAt: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
  };
  bankAccount: {
    id: string | null;
    accountHolderName: string | null;
    accountNumber: string | null;
    ifscCode: string | null;
  };
};

export type AdminLiveDepositHistorySummary = {
  totalUsersWithDeposits: number;
  totalActivatedAccounts: number;
};

function getSingleRow<T>(value: T | T[] | null) {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] || null : value;
}

function buildActivationLookup(rows: ActivationMapRow[]) {
  const lookup = new Map<string, string>();

  rows
    .sort((left, right) => {
      const leftCreated = left.created_at ? new Date(left.created_at).getTime() : 0;
      const rightCreated = right.created_at ? new Date(right.created_at).getTime() : 0;

      return rightCreated - leftCreated;
    })
    .forEach((row) => {
      if (!row.user_id || !row.bank_account_id) {
        return;
      }

      const key = `${row.user_id}:${row.bank_account_id}`;

      if (!lookup.has(key)) {
        lookup.set(key, row.id);
      }
    });

  return lookup;
}

export async function fetchAdminLiveDepositHistory() {
  const [historyResponse, activationsResponse, activatedCountResponse] = await Promise.all([
    supabase
      .from("live_deposits")
      .select(`
        id,
        user_id,
        bank_account_id,
        amount,
        type,
        status,
        description,
        created_at,
        profiles!live_deposits_user_id_fkey (
          id,
          email,
          name,
          avatar,
          role
        ),
        bank_accounts (
          id,
          account_holder_name,
          account_number,
          ifsc_code
        )
      `)
      .order("created_at", { ascending: false }),
    supabase
      .from("account_activations")
      .select("id, user_id, bank_account_id, created_at")
      .eq("status", "approved"),
    supabase
      .from("account_activations")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
  ]);

  if (historyResponse.error) {
    throw historyResponse.error;
  }

  if (activationsResponse.error) {
    throw activationsResponse.error;
  }

  if (activatedCountResponse.error) {
    throw activatedCountResponse.error;
  }

  const activationLookup = buildActivationLookup(
    (activationsResponse.data || []) as ActivationMapRow[]
  );

  const records = ((historyResponse.data || []) as LiveDepositRow[])
    .map((row) => {
      const profile = getSingleRow(row.profiles);
      const bankAccount = getSingleRow(row.bank_accounts);

      if (!row.user_id || !profile || profile.role !== "user") {
        return null;
      }

      const requestId = row.bank_account_id
        ? activationLookup.get(`${row.user_id}:${row.bank_account_id}`) || null
        : null;

      return {
        id: row.id,
        requestId,
        userId: row.user_id,
        amount: Number(row.amount || 0),
        type: row.type === "debit" ? "debit" : "credit",
        status: row.status,
        description: row.description,
        createdAt: row.created_at,
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        },
        bankAccount: {
          id: row.bank_account_id,
          accountHolderName: bankAccount?.account_holder_name || profile.name,
          accountNumber: bankAccount?.account_number || null,
          ifscCode: bankAccount?.ifsc_code || null,
        },
      } satisfies AdminLiveDepositHistoryRecord;
    })
    .filter(Boolean) as AdminLiveDepositHistoryRecord[];

  return {
    records,
    summary: {
      totalUsersWithDeposits: new Set(records.map((record) => record.userId)).size,
      totalActivatedAccounts: activatedCountResponse.count || 0,
    } satisfies AdminLiveDepositHistorySummary,
  };
}
