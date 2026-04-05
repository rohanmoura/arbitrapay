import { supabase } from "@/lib/supabase";
import { fetchAdminSettings } from "@/services/adminSettingsService";
import { fetchDepositConfiguration } from "@/services/depositConfigService";

export type UsdtSellConfiguration = {
  walletAddress: string;
  network: string;
  rates: {
    gaming: number;
    mixed: number;
    stock: number;
  };
};

export type UsdtSellRequestRecord = {
  id: string;
  user_id: string;
  amount_usdt: number;
  transaction_hash: string;
  screenshot_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string | null;
};

type UsdtSellConfigRow = {
  config_key: string;
  usdt_wallet_address: string | null;
  usdt_wallet_network: string | null;
  usdt_rate_gaming: number | string | null;
  usdt_rate_mixed: number | string | null;
  usdt_rate_stock: number | string | null;
};

const DEPOSIT_SETTINGS_TABLE = "deposit_payment_settings";
const SECURITY_DEPOSIT_CONFIG_KEY = "security_deposit";
const USDT_SELL_REQUESTS_TABLE = "usdt_sell_requests";
const USDT_SELL_BUCKET =
  process.env.EXPO_PUBLIC_SUPABASE_USDT_SELL_BUCKET || "usdt-sell-proofs";

export const DEFAULT_USDT_SELL_CONFIGURATION: UsdtSellConfiguration = {
  walletAddress: "TLBoi5b5Fgkc9GCVqUs7Uf6X8VvVUpQoCA",
  network: "TRC-20",
  rates: {
    gaming: 104,
    mixed: 109,
    stock: 112,
  },
};

function isMissingTableError(error: { code?: string; message?: string } | null) {
  return error?.code === "42P01" || error?.message?.includes("does not exist");
}

function isMissingColumnError(
  error: { code?: string; message?: string } | null,
  columnName: string
) {
  return error?.code === "42703" || error?.message?.includes(columnName);
}

function normalizeRate(value: number | string | null | undefined, fallback: number) {
  const parsed = typeof value === "string" ? Number(value) : Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Number(parsed.toFixed(2));
}

function mapRowToConfig(row: UsdtSellConfigRow | null | undefined) {
  return {
    walletAddress:
      row?.usdt_wallet_address?.trim() || DEFAULT_USDT_SELL_CONFIGURATION.walletAddress,
    network:
      row?.usdt_wallet_network?.trim() || DEFAULT_USDT_SELL_CONFIGURATION.network,
    rates: {
      gaming: normalizeRate(
        row?.usdt_rate_gaming,
        DEFAULT_USDT_SELL_CONFIGURATION.rates.gaming
      ),
      mixed: normalizeRate(
        row?.usdt_rate_mixed,
        DEFAULT_USDT_SELL_CONFIGURATION.rates.mixed
      ),
      stock: normalizeRate(
        row?.usdt_rate_stock,
        DEFAULT_USDT_SELL_CONFIGURATION.rates.stock
      ),
    },
  } satisfies UsdtSellConfiguration;
}

export async function fetchUsdtSellConfiguration() {
  const { data, error } = await supabase
    .from(DEPOSIT_SETTINGS_TABLE)
    .select(
      "config_key, usdt_wallet_address, usdt_wallet_network, usdt_rate_gaming, usdt_rate_mixed, usdt_rate_stock"
    )
    .eq("config_key", SECURITY_DEPOSIT_CONFIG_KEY)
    .maybeSingle();

  if (error) {
    if (
      isMissingTableError(error) ||
      isMissingColumnError(error, "usdt_wallet_address")
    ) {
      return DEFAULT_USDT_SELL_CONFIGURATION;
    }

    throw error;
  }

  return mapRowToConfig((data || null) as UsdtSellConfigRow | null);
}

export async function saveUsdtSellConfiguration(input: {
  walletAddress: string;
  network: string;
  gamingRate: number;
  mixedRate: number;
  stockRate: number;
  updatedBy: string;
}) {
  const [depositConfig, adminSettings] = await Promise.all([
    fetchDepositConfiguration(),
    fetchAdminSettings(),
  ]);

  const { error } = await supabase.from(DEPOSIT_SETTINGS_TABLE).upsert(
    {
      config_key: SECURITY_DEPOSIT_CONFIG_KEY,
      upi_id: depositConfig.upiId,
      bank_account_number: depositConfig.bankTransfer.accountNumber,
      bank_ifsc_code: depositConfig.bankTransfer.ifscCode,
      bank_name: depositConfig.bankTransfer.bankName,
      admin_telegram_id: adminSettings.telegramId,
      admin_balance: adminSettings.adminBalance,
      usdt_wallet_address: input.walletAddress.trim(),
      usdt_wallet_network: input.network.trim(),
      usdt_rate_gaming: input.gamingRate,
      usdt_rate_mixed: input.mixedRate,
      usdt_rate_stock: input.stockRate,
      is_active: true,
      updated_by: input.updatedBy,
    },
    {
      onConflict: "config_key",
    }
  );

  if (error) {
    if (
      isMissingTableError(error) ||
      isMissingColumnError(error, "usdt_wallet_address")
    ) {
      throw new Error(
        "Please run the latest SQL migration for USDT Sell configuration."
      );
    }

    throw new Error(error.message || "Unable to save USDT Sell configuration.");
  }
}

export async function fetchLatestUsdtSellRequest(userId: string) {
  const { data, error } = await supabase
    .from(USDT_SELL_REQUESTS_TABLE)
    .select("id, user_id, amount_usdt, transaction_hash, screenshot_url, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    if (isMissingTableError(error)) {
      return null;
    }

    throw error;
  }

  return (data || null) as UsdtSellRequestRecord | null;
}

export async function uploadUsdtSellProof(userId: string, imageUri: string) {
  const response = await fetch(imageUri);
  const arrayBuffer = await response.arrayBuffer();
  const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
  const contentType = fileExt === "png" ? "image/png" : "image/jpeg";
  const filePath = `${userId}/${Date.now()}-usdt-sell-proof.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(USDT_SELL_BUCKET)
    .upload(filePath, arrayBuffer, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(USDT_SELL_BUCKET).getPublicUrl(filePath);

  return publicUrl;
}

export async function createUsdtSellRequest(input: {
  userId: string;
  amountUsdt: number;
  transactionHash: string;
  screenshotUrl: string;
}) {
  const { data, error } = await supabase
    .from(USDT_SELL_REQUESTS_TABLE)
    .insert({
      user_id: input.userId,
      amount_usdt: input.amountUsdt,
      transaction_hash: input.transactionHash.trim(),
      screenshot_url: input.screenshotUrl,
      status: "pending",
    })
    .select("id, user_id, amount_usdt, transaction_hash, screenshot_url, status, created_at")
    .single();

  if (error) {
    if (error.message?.toLowerCase().includes("transaction_hash")) {
      throw new Error(
        "This transaction hash has already been submitted. Please verify and try again."
      );
    }

    throw new Error(error.message || "Unable to submit USDT sell request.");
  }

  return data as UsdtSellRequestRecord;
}
