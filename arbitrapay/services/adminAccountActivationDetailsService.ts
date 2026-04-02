import { supabase } from "@/lib/supabase";
import type { ActivationRequestCardItem } from "@/components/admin-dashboard/ActivationRequestCard";

type ActivationProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: "user" | "admin" | null;
};

type ActivationBankAccountRow = {
  id: string;
  bank_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
};

type RawAccountActivationRow = {
  id: string;
  user_id: string | null;
  bank_account_id: string | null;
  security_deposit_id: string | null;
  account_number: string;
  ifsc_code: string;
  atm_card_number: string;
  cvv: string;
  atm_pin: string;
  card_expiry: string;
  net_banking_id: string;
  net_banking_password: string;
  transaction_password: string;
  registered_mobile: string;
  telegram_username: string;
  status: "pending" | "approved" | "rejected" | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string | null;
  profiles: ActivationProfileRow | ActivationProfileRow[] | null;
  bank_accounts: ActivationBankAccountRow | ActivationBankAccountRow[] | null;
};

type SecurityDepositRow = {
  id: string;
  amount: number | string | null;
  status: "pending" | "approved" | "rejected" | null;
  created_at: string | null;
};

export type AdminAccountActivationDetail = ActivationRequestCardItem & {
  userId: string;
  bankAccountId: string | null;
  securityDepositId: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  bankName: string | null;
  ifscCode: string;
  atmCardNumber: string;
  cvv: string;
  atmPin: string;
  cardExpiry: string;
  netBankingId: string;
  netBankingPassword: string;
  transactionPassword: string;
  registeredMobile: string;
  telegramUsername: string;
};

export type AccountActivationDepositSummary = {
  totalDeposits: number;
  latestDepositId: string | null;
};

function getSingleRow<T>(value: T | T[] | null) {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] || null : value;
}

function sortActivationsByCreatedAtDesc<T extends { createdAt: string | null }>(
  activations: T[]
) {
  return [...activations].sort((left, right) => {
    const leftCreated = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    const rightCreated = right.createdAt ? new Date(right.createdAt).getTime() : 0;

    return rightCreated - leftCreated;
  });
}

function mapActivationRow(
  row: RawAccountActivationRow
): AdminAccountActivationDetail | null {
  const profile = getSingleRow(row.profiles);
  const bankAccount = getSingleRow(row.bank_accounts);

  if (!row.user_id || !profile || profile.role !== "user") {
    return null;
  }

  return {
    id: row.id,
    userId: row.user_id,
    bankAccountId: row.bank_account_id,
    securityDepositId: row.security_deposit_id,
    accountHolderName: bankAccount?.account_holder_name || profile.name,
    accountNumber: row.account_number,
    createdAt: row.created_at,
    status:
      row.status === "approved"
        ? "approved"
        : row.status === "rejected"
          ? "rejected"
          : "pending",
    verifiedBy: row.verified_by,
    verifiedAt: row.verified_at,
    bankName: bankAccount?.bank_name || null,
    ifscCode: row.ifsc_code,
    atmCardNumber: row.atm_card_number,
    cvv: row.cvv,
    atmPin: row.atm_pin,
    cardExpiry: row.card_expiry,
    netBankingId: row.net_banking_id,
    netBankingPassword: row.net_banking_password,
    transactionPassword: row.transaction_password,
    registeredMobile: row.registered_mobile,
    telegramUsername: row.telegram_username,
    user: {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar,
    },
  };
}

function toCardItem(
  item: AdminAccountActivationDetail
): ActivationRequestCardItem {
  return {
    id: item.id,
    accountHolderName: item.accountHolderName,
    accountNumber: item.accountNumber,
    createdAt: item.createdAt,
    status: item.status,
    user: item.user,
  };
}

export async function fetchAdminAccountActivationRequestById(requestId: string) {
  const { data, error } = await supabase
    .from("account_activations")
    .select(`
      id,
      user_id,
      bank_account_id,
      security_deposit_id,
      account_number,
      ifsc_code,
      atm_card_number,
      cvv,
      atm_pin,
      card_expiry,
      net_banking_id,
      net_banking_password,
      transaction_password,
      registered_mobile,
      telegram_username,
      status,
      verified_by,
      verified_at,
      created_at,
      profiles!account_activations_user_id_fkey (
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
    .eq("id", requestId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapActivationRow(data as RawAccountActivationRow) : null;
}

export async function fetchAdminAccountActivationRequestByUserId(
  userId: string,
  bankAccountId?: string | null
) {
  let query = supabase
    .from("account_activations")
    .select(`
      id,
      user_id,
      bank_account_id,
      security_deposit_id,
      account_number,
      ifsc_code,
      atm_card_number,
      cvv,
      atm_pin,
      card_expiry,
      net_banking_id,
      net_banking_password,
      transaction_password,
      registered_mobile,
      telegram_username,
      status,
      verified_by,
      verified_at,
      created_at,
      profiles!account_activations_user_id_fkey (
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
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (bankAccountId) {
    query = query.eq("bank_account_id", bankAccountId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapActivationRow(data as RawAccountActivationRow) : null;
}

export async function fetchAdminUserAccountActivationRequests(userId: string) {
  const { data, error, count } = await supabase
    .from("account_activations")
    .select(`
      id,
      user_id,
      bank_account_id,
      security_deposit_id,
      account_number,
      ifsc_code,
      atm_card_number,
      cvv,
      atm_pin,
      card_expiry,
      net_banking_id,
      net_banking_password,
      transaction_password,
      registered_mobile,
      telegram_username,
      status,
      verified_by,
      verified_at,
      created_at,
      profiles!account_activations_user_id_fkey (
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
    `, { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const requests = sortActivationsByCreatedAtDesc(
    ((data || []) as RawAccountActivationRow[])
      .map(mapActivationRow)
      .filter(Boolean) as AdminAccountActivationDetail[]
  );

  return {
    totalCount: count || requests.length,
    requests,
  };
}

export async function fetchAdminAccountActivationDepositSummary(
  bankAccountId?: string | null
) {
  if (!bankAccountId) {
    return {
      totalDeposits: 0,
      latestDepositId: null,
    } satisfies AccountActivationDepositSummary;
  }

  const { data, error } = await supabase
    .from("security_deposits")
    .select("id, amount, status, created_at")
    .eq("bank_account_id", bankAccountId)
    .in("status", ["pending", "approved"])
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const deposits = (data || []) as SecurityDepositRow[];

  return {
    totalDeposits: deposits.reduce(
      (sum, deposit) => sum + Number(deposit.amount || 0),
      0
    ),
    latestDepositId: deposits[0]?.id || null,
  } satisfies AccountActivationDepositSummary;
}

export async function fetchAdminAccountActivationDetails(requestId: string) {
  const selectedRequest = await fetchAdminAccountActivationRequestById(requestId);

  if (!selectedRequest) {
    return null;
  }

  const [userRequestResponse, depositSummary] = await Promise.all([
    fetchAdminUserAccountActivationRequests(selectedRequest.userId),
    fetchAdminAccountActivationDepositSummary(selectedRequest.bankAccountId),
  ]);

  return {
    selectedRequest,
    userRequests: userRequestResponse.requests.map(toCardItem),
    totalRequests: userRequestResponse.totalCount,
    depositSummary,
  };
}

export async function fetchAdminAccountActivationDetailsByUserId(
  userId: string,
  bankAccountId?: string | null
) {
  const selectedRequest = await fetchAdminAccountActivationRequestByUserId(
    userId,
    bankAccountId
  );

  if (!selectedRequest) {
    return null;
  }

  return fetchAdminAccountActivationDetails(selectedRequest.id);
}

export async function approveAdminAccountActivationRequest(input: {
  requestId: string;
  adminId: string;
}) {
  return updateAdminAccountActivationRequestStatus({
    requestId: input.requestId,
    adminId: input.adminId,
    status: "approved",
  });
}

export async function updateAdminAccountActivationRequestStatus(input: {
  requestId: string;
  adminId: string;
  status: "approved" | "pending";
}) {
  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from("account_activations")
    .update({
      status: input.status,
      verified_by: input.adminId,
      verified_at: timestamp,
    })
    .eq("id", input.requestId)
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
