import { supabase } from "@/lib/supabase";

type ActivationProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: "user" | "admin" | null;
};

type ActivationBankAccountRow = {
  id: string;
  account_holder_name: string | null;
};

type RawAccountActivationRow = {
  id: string;
  user_id: string | null;
  account_number: string;
  created_at: string | null;
  status: "pending" | "approved" | "rejected" | null;
  profiles: ActivationProfileRow | ActivationProfileRow[] | null;
  bank_accounts: ActivationBankAccountRow | ActivationBankAccountRow[] | null;
};

export type AdminAccountActivationStatus = "approved" | "pending";

export type AdminAccountActivationRequest = {
  id: string;
  userId: string;
  accountHolderName: string | null;
  accountNumber: string;
  createdAt: string | null;
  status: AdminAccountActivationStatus;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
  };
};

export type AdminAccountActivationsSummary = {
  total: number;
  activated: number;
  notActivated: number;
};

function getSingleRow<T>(value: T | T[] | null) {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] || null : value;
}

function sortByCreatedAtDesc(
  requests: AdminAccountActivationRequest[]
) {
  return [...requests].sort((left, right) => {
    const leftCreated = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    const rightCreated = right.createdAt ? new Date(right.createdAt).getTime() : 0;

    return rightCreated - leftCreated;
  });
}

export async function fetchAdminAccountActivations() {
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
    .in("status", ["pending", "approved"])
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const mappedRequests = ((data || []) as RawAccountActivationRow[])
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
        status: row.status === "approved" ? "approved" : "pending",
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        },
      } satisfies AdminAccountActivationRequest;
    })
    .filter(Boolean) as AdminAccountActivationRequest[];

  const requests = sortByCreatedAtDesc(mappedRequests);

  return {
    requests,
    summary: {
      total: requests.length,
      activated: requests.filter((request) => request.status === "approved").length,
      notActivated: requests.filter((request) => request.status === "pending").length,
    } satisfies AdminAccountActivationsSummary,
  };
}
