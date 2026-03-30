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
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
};

type RawAdminUserSecurityDepositRow = {
  id: string;
  user_id: string | null;
  deposit_method: "UPI" | "BANK_TRANSFER";
  amount: number | string | null;
  utr_number: string | null;
  payment_proof_url: string | null;
  status: "pending" | "approved" | "rejected" | null;
  created_at: string | null;
  verified_at: string | null;
  verified_by: string | null;
  profiles: SecurityDepositProfileRow | SecurityDepositProfileRow[] | null;
  bank_accounts: SecurityDepositBankAccountRow | SecurityDepositBankAccountRow[] | null;
};

export type AdminUserSecurityDepositRecord = {
  id: string;
  userId: string;
  depositMethod: "UPI" | "BANK_TRANSFER";
  amount: number;
  utrNumber: string | null;
  paymentProofUrl: string | null;
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

function mapDeposit(row: RawAdminUserSecurityDepositRow) {
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
    utrNumber: row.utr_number,
    paymentProofUrl: row.payment_proof_url,
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
  } satisfies AdminUserSecurityDepositRecord;
}

function dedupeDeposits(rows: AdminUserSecurityDepositRecord[]) {
  const map = new Map<string, AdminUserSecurityDepositRecord>();

  rows.forEach((row) => {
    if (!map.has(row.id)) {
      map.set(row.id, row);
    }
  });

  return [...map.values()];
}

export async function fetchAdminUserSecurityDepositDetail(depositId: string) {
  const selectedResponse = await supabase
    .from("security_deposits")
    .select(
      `
      id,
      user_id,
      deposit_method,
      amount,
      utr_number,
      payment_proof_url,
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
        account_holder_name,
        account_number,
        ifsc_code
      )
    `
    )
    .eq("id", depositId)
    .maybeSingle();

  if (selectedResponse.error) {
    throw selectedResponse.error;
  }

  const selectedDeposit = selectedResponse.data
    ? mapDeposit(selectedResponse.data as RawAdminUserSecurityDepositRow)
    : null;

  if (!selectedDeposit) {
    return null;
  }

  const userDepositsResponse = await supabase
    .from("security_deposits")
    .select(
      `
      id,
      user_id,
      deposit_method,
      amount,
      utr_number,
      payment_proof_url,
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
        account_holder_name,
        account_number,
        ifsc_code
      )
    `
    )
    .eq("user_id", selectedDeposit.userId)
    .order("created_at", { ascending: false });

  if (userDepositsResponse.error) {
    throw userDepositsResponse.error;
  }

  return {
    selectedDeposit,
    userDeposits: dedupeDeposits(
      ((userDepositsResponse.data || []) as RawAdminUserSecurityDepositRow[])
        .map(mapDeposit)
        .filter(Boolean) as AdminUserSecurityDepositRecord[]
    ),
  };
}
