import { supabase } from "@/lib/supabase";

export type DepositConfiguration = {
  upiId: string;
  bankTransfer: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
};

type DepositConfigRow = {
  config_key: string;
  upi_id: string | null;
  bank_account_number: string | null;
  bank_ifsc_code: string | null;
  bank_name: string | null;
  is_active: boolean | null;
};

const DEPOSIT_CONFIG_TABLE = "deposit_payment_settings";
const SECURITY_DEPOSIT_CONFIG_KEY = "security_deposit";

export const DEFAULT_SECURITY_DEPOSIT_CONFIG: DepositConfiguration = {
  upiId: "9625159323@pthdfc",
  bankTransfer: {
    accountNumber: "50100607454408",
    ifscCode: "HDFC0003370",
    bankName: "HDFC Bank",
  },
};

function isMissingTableError(error: { code?: string; message?: string } | null) {
  return error?.code === "42P01" || error?.message?.includes("does not exist");
}

function mapRowToConfiguration(
  row: DepositConfigRow | null | undefined
): DepositConfiguration {
  if (!row) {
    return DEFAULT_SECURITY_DEPOSIT_CONFIG;
  }

  return {
    upiId: row.upi_id || DEFAULT_SECURITY_DEPOSIT_CONFIG.upiId,
    bankTransfer: {
      accountNumber:
        row.bank_account_number ||
        DEFAULT_SECURITY_DEPOSIT_CONFIG.bankTransfer.accountNumber,
      ifscCode:
        row.bank_ifsc_code || DEFAULT_SECURITY_DEPOSIT_CONFIG.bankTransfer.ifscCode,
      bankName: row.bank_name || DEFAULT_SECURITY_DEPOSIT_CONFIG.bankTransfer.bankName,
    },
  };
}

export async function fetchDepositConfiguration() {
  const { data, error } = await supabase
    .from(DEPOSIT_CONFIG_TABLE)
    .select(
      "config_key, upi_id, bank_account_number, bank_ifsc_code, bank_name, is_active"
    )
    .eq("config_key", SECURITY_DEPOSIT_CONFIG_KEY)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    if (isMissingTableError(error)) {
      return DEFAULT_SECURITY_DEPOSIT_CONFIG;
    }

    throw error;
  }

  return mapRowToConfiguration((data || null) as DepositConfigRow | null);
}

export async function saveDepositConfiguration(input: {
  upiId: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  updatedBy: string;
}) {
  const { error } = await supabase.from(DEPOSIT_CONFIG_TABLE).upsert(
    {
      config_key: SECURITY_DEPOSIT_CONFIG_KEY,
      upi_id: input.upiId,
      bank_account_number: input.accountNumber,
      bank_ifsc_code: input.ifscCode,
      bank_name: input.bankName,
      is_active: true,
      updated_by: input.updatedBy,
    },
    {
      onConflict: "config_key",
    }
  );

  if (error) {
    if (isMissingTableError(error)) {
      throw new Error(
        "Please create the deposit payment settings table in Supabase first."
      );
    }

    throw new Error(error.message || "Unable to save deposit configuration.");
  }
}
