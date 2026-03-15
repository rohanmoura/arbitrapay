import { supabase } from "@/lib/supabase";
import {
  DEFAULT_SECURITY_DEPOSIT_CONFIG,
  fetchDepositConfiguration,
  type DepositConfiguration,
} from "@/services/depositConfigService";

export type DepositMethod = "UPI" | "BANK_TRANSFER";

export type SecurityDepositRecord = {
  id: string;
  user_id: string;
  deposit_method: DepositMethod;
  amount: number;
  utr_number: string;
  payment_proof_url: string;
  bank_account_id: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string | null;
};

type DepositBankAccount = {
  id: string;
  is_default: boolean | null;
  created_at: string | null;
};

const SECURITY_DEPOSIT_BUCKET =
  process.env.EXPO_PUBLIC_SUPABASE_SECURITY_DEPOSIT_BUCKET || "security-deposits";

function sortBankAccounts(accounts: DepositBankAccount[]) {
  return [...accounts].sort((left, right) => {
    const leftPrimary = Boolean(left.is_default);
    const rightPrimary = Boolean(right.is_default);

    if (leftPrimary !== rightPrimary) {
      return leftPrimary ? -1 : 1;
    }

    const leftCreated = left.created_at ? new Date(left.created_at).getTime() : 0;
    const rightCreated = right.created_at ? new Date(right.created_at).getTime() : 0;

    return leftCreated - rightCreated;
  });
}

export async function fetchLatestSecurityDeposit(userId: string) {
  const { data, error } = await supabase
    .from("security_deposits")
    .select(
      "id, user_id, deposit_method, amount, utr_number, payment_proof_url, bank_account_id, status, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data || null) as SecurityDepositRecord | null;
}

export async function fetchSecurityDepositConfiguration() {
  return fetchDepositConfiguration();
}

export const SECURITY_DEPOSIT_CONFIG: DepositConfiguration =
  DEFAULT_SECURITY_DEPOSIT_CONFIG;

export async function fetchUserDepositBankAccount(userId: string) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("id, is_default, created_at")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  const accounts = sortBankAccounts((data || []) as DepositBankAccount[]);

  return accounts[0] || null;
}

export async function uploadSecurityDepositProof(userId: string, imageUri: string) {
  const response = await fetch(imageUri);
  const arrayBuffer = await response.arrayBuffer();
  const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
  const contentType = fileExt === "png" ? "image/png" : "image/jpeg";
  const filePath = `${userId}/${Date.now()}-deposit-proof.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(SECURITY_DEPOSIT_BUCKET)
    .upload(filePath, arrayBuffer, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(SECURITY_DEPOSIT_BUCKET).getPublicUrl(filePath);

  return publicUrl;
}

export async function createSecurityDepositRequest(input: {
  userId: string;
  amount: number;
  utrNumber: string;
  paymentProofUrl: string;
  depositMethod: DepositMethod;
  bankAccountId: string;
}) {
  const { data, error } = await supabase
    .from("security_deposits")
    .insert({
      user_id: input.userId,
      amount: input.amount,
      utr_number: input.utrNumber,
      payment_proof_url: input.paymentProofUrl,
      deposit_method: input.depositMethod,
      bank_account_id: input.bankAccountId,
      status: "pending",
    })
    .select(
      "id, user_id, deposit_method, amount, utr_number, payment_proof_url, bank_account_id, status, created_at"
    )
    .single();

  if (error) {
    // 🔹 Duplicate UTR
    if (error.message?.toLowerCase().includes("utr")) {
      throw new Error(
        "This transaction ID / UTR has already been used. Please check and enter a correct one."
      );
    }

    // 🔹 Deposit method constraint
    if (error.message?.includes("deposit_method_check")) {
      throw new Error("Invalid deposit method selected.");
    }

    // 🔹 Generic fallback
    throw new Error("Unable to submit deposit request. Please try again.");
  }

  return data as SecurityDepositRecord;
}
