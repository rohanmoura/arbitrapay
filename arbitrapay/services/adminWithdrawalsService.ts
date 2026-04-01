import { supabase } from "@/lib/supabase";

type WithdrawalProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: "user" | "admin" | null;
};

type WithdrawalBankAccountRow = {
  id: string;
  bank_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
};

type RawAdminWithdrawalRow = {
  id: string;
  user_id: string | null;
  amount: number | string | null;
  status: "pending" | "approved" | "rejected" | null;
  created_at: string | null;
  verified_at: string | null;
  verified_by: string | null;
  profiles: WithdrawalProfileRow | WithdrawalProfileRow[] | null;
  bank_accounts: WithdrawalBankAccountRow | WithdrawalBankAccountRow[] | null;
};

export type AdminWithdrawalRecord = {
  id: string;
  userId: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
  user: {
    id: string;
    email: string | null;
    name: string | null;
    avatar: string | null;
  };
  bankAccount: {
    id: string;
    bankName: string | null;
    accountHolderName: string | null;
    accountNumber: string | null;
    ifscCode: string | null;
  } | null;
};

export type AdminWithdrawalStatus = "approved" | "pending";

function getSingleRow<T>(value: T | T[] | null) {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] || null : value;
}

export async function fetchAdminWithdrawals() {
  const { data, error } = await supabase
    .from("withdrawals")
    .select(`
      id,
      user_id,
      amount,
      status,
      created_at,
      verified_at,
      verified_by,
      profiles!withdrawals_user_id_fkey (
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
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const mappedRows = ((data || []) as RawAdminWithdrawalRow[])
    .map((row) => {
      const profile = getSingleRow(row.profiles);
      const bankAccount = getSingleRow(row.bank_accounts);

      if (!row.user_id || !profile || profile.role !== "user") {
        return null;
      }

      return {
        id: row.id,
        userId: row.user_id,
        amount: Number(row.amount || 0),
        status:
          row.status === "approved"
            ? "approved"
            : row.status === "rejected"
              ? "rejected"
              : "pending",
        createdAt: row.created_at,
        verifiedAt: row.verified_at,
        verifiedBy: row.verified_by,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar,
        },
        bankAccount: bankAccount
          ? {
              id: bankAccount.id,
              bankName: bankAccount.bank_name,
              accountHolderName: bankAccount.account_holder_name,
              accountNumber: bankAccount.account_number,
              ifscCode: bankAccount.ifsc_code,
            }
          : null,
      } satisfies AdminWithdrawalRecord;
    })
    .filter(Boolean) as AdminWithdrawalRecord[];

  const dedupedRows = new Map<string, AdminWithdrawalRecord>();

  mappedRows.forEach((row) => {
    if (!dedupedRows.has(row.id)) {
      dedupedRows.set(row.id, row);
    }
  });

  return [...dedupedRows.values()];
}

export async function updateAdminWithdrawalStatus(input: {
  withdrawalId: string;
  adminId: string;
  status: AdminWithdrawalStatus;
}) {
  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from("withdrawals")
    .update({
      status: input.status,
      verified_by: input.adminId,
      verified_at: timestamp,
    })
    .eq("id", input.withdrawalId)
    .select("id, status, verified_by, verified_at")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    status: data.status === "approved" ? "approved" : "pending",
    verifiedBy: data.verified_by,
    verifiedAt: data.verified_at,
  };
}
