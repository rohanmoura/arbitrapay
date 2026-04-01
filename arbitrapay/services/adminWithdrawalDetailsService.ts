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

type RawAdminUserWithdrawalRow = {
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

type SecurityDepositAmountRow = {
  amount: number | string | null;
};

export type AdminUserWithdrawalRecord = {
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

function getSingleRow<T>(value: T | T[] | null) {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] || null : value;
}

function mapWithdrawal(row: RawAdminUserWithdrawalRow) {
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
  } satisfies AdminUserWithdrawalRecord;
}

function dedupeWithdrawals(rows: AdminUserWithdrawalRecord[]) {
  const map = new Map<string, AdminUserWithdrawalRecord>();

  rows.forEach((row) => {
    if (!map.has(row.id)) {
      map.set(row.id, row);
    }
  });

  return [...map.values()];
}

export async function fetchAdminUserWithdrawalDetail(withdrawalId: string) {
  const selectedResponse = await supabase
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
    .eq("id", withdrawalId)
    .maybeSingle();

  if (selectedResponse.error) {
    throw selectedResponse.error;
  }

  const selectedWithdrawal = selectedResponse.data
    ? mapWithdrawal(selectedResponse.data as RawAdminUserWithdrawalRow)
    : null;

  if (!selectedWithdrawal) {
    return null;
  }

  const [userWithdrawalsResponse, totalDepositedAmountResponse] = await Promise.all([
    supabase
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
      .eq("user_id", selectedWithdrawal.userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("security_deposits")
      .select("amount")
      .eq("user_id", selectedWithdrawal.userId)
      .eq("bank_account_id", selectedWithdrawal.bankAccount?.id || ""),
  ]);

  if (userWithdrawalsResponse.error) {
    throw userWithdrawalsResponse.error;
  }

  if (totalDepositedAmountResponse.error) {
    throw totalDepositedAmountResponse.error;
  }

  const totalDepositedAmount = ((totalDepositedAmountResponse.data || []) as SecurityDepositAmountRow[])
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);

  return {
    selectedWithdrawal,
    userWithdrawals: dedupeWithdrawals(
      ((userWithdrawalsResponse.data || []) as RawAdminUserWithdrawalRow[])
        .map(mapWithdrawal)
        .filter(Boolean) as AdminUserWithdrawalRecord[]
    ),
    totalDepositedAmount,
  };
}
