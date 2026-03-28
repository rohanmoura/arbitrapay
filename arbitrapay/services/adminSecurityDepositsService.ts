import { supabase } from "@/lib/supabase";

type SecurityDepositProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: "user" | "admin" | null;
};

type SecurityDepositBankAccountRow = {
  id: string;
  bank_name: string | null;
  account_number: string | null;
};

type RawAdminSecurityDepositRow = {
  id: string;
  user_id: string | null;
  deposit_method: "UPI" | "BANK_TRANSFER";
  amount: number | string | null;
  status: "pending" | "approved" | "rejected" | null;
  created_at: string | null;
  verified_at: string | null;
  verified_by: string | null;
  profiles: SecurityDepositProfileRow | SecurityDepositProfileRow[] | null;
  bank_accounts: SecurityDepositBankAccountRow | SecurityDepositBankAccountRow[] | null;
};

export type AdminSecurityDepositRecord = {
  id: string;
  userId: string;
  depositMethod: "UPI" | "BANK_TRANSFER";
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
    accountNumber: string | null;
  } | null;
};

export type AdminSecurityDepositStatus = "approved" | "pending";

function getSingleRow<T>(value: T | T[] | null) {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] || null : value;
}

export function isNewSecurityDepositRequest(record: Pick<
  AdminSecurityDepositRecord,
  "status" | "verifiedAt" | "verifiedBy"
>) {
  return record.status === "pending" && !record.verifiedAt && !record.verifiedBy;
}

export async function fetchAdminSecurityDeposits() {
  const { data, error } = await supabase
    .from("security_deposits")
    .select(`
      id,
      user_id,
      deposit_method,
      amount,
      status,
      created_at,
      verified_at,
      verified_by,
      profiles!security_deposits_user_id_fkey (
        id,
        email,
        name,
        avatar,
        role
      ),
      bank_accounts (
        id,
        bank_name,
        account_number
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const mappedRows = ((data || []) as RawAdminSecurityDepositRow[])
    .map((row) => {
      const profile = getSingleRow(row.profiles);
      const bankAccount = getSingleRow(row.bank_accounts);

      if (!row.user_id || !profile || profile.role !== "user") {
        return null;
      }

      return {
        id: row.id,
        userId: row.user_id,
        depositMethod: row.deposit_method,
        amount: Number(row.amount || 0),
        status: row.status === "approved" ? "approved" : row.status === "rejected" ? "rejected" : "pending",
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
              accountNumber: bankAccount.account_number,
            }
          : null,
      } satisfies AdminSecurityDepositRecord;
    })
    .filter(Boolean) as AdminSecurityDepositRecord[];

  const dedupedRows = new Map<string, AdminSecurityDepositRecord>();

  mappedRows.forEach((row) => {
    if (!dedupedRows.has(row.id)) {
      dedupedRows.set(row.id, row);
    }
  });

  return [...dedupedRows.values()];
}

export async function updateAdminSecurityDepositStatus(input: {
  depositId: string;
  adminId: string;
  status: AdminSecurityDepositStatus;
}) {
  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from("security_deposits")
    .update({
      status: input.status,
      verified_by: input.adminId,
      verified_at: timestamp,
    })
    .eq("id", input.depositId)
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
