import { supabase } from "@/lib/supabase";
import { fetchDepositConfiguration } from "@/services/depositConfigService";

type DepositPaymentSettingsRow = {
  admin_telegram_id: string | null;
  admin_balance: number | string | null;
  config_key: string;
};

const DEPOSIT_PAYMENT_SETTINGS_TABLE = "deposit_payment_settings";
const SECURITY_DEPOSIT_CONFIG_KEY = "security_deposit";
export const DEFAULT_ADMIN_TELEGRAM_ID = "@arbitrapay_admin";
export const DEFAULT_ADMIN_BALANCE = 73893821;

function isMissingTableError(error: { code?: string; message?: string } | null) {
  return error?.code === "42P01" || error?.message?.includes("does not exist");
}

function isMissingColumnError(
  error: { code?: string; message?: string } | null,
  columnName: string
) {
  return error?.code === "42703" || error?.message?.includes(columnName);
}

function normalizeTelegramId(value?: string | null) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return DEFAULT_ADMIN_TELEGRAM_ID;
  }

  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function normalizeAdminBalance(value?: number | string | null) {
  const numericValue =
    typeof value === "string" ? Number(value.replace(/,/g, "").trim()) : Number(value);

  if (!Number.isFinite(numericValue)) {
    return DEFAULT_ADMIN_BALANCE;
  }

  return Math.max(0, Math.round(numericValue));
}

export function buildTelegramUrl(telegramId?: string | null) {
  const normalized = normalizeTelegramId(telegramId);

  return `https://t.me/${normalized.replace(/^@/, "")}`;
}

export async function fetchAdminSettings() {
  const { data, error } = await supabase
    .from(DEPOSIT_PAYMENT_SETTINGS_TABLE)
    .select("config_key, admin_telegram_id, admin_balance")
    .eq("config_key", SECURITY_DEPOSIT_CONFIG_KEY)
    .maybeSingle();

  if (error) {
    if (isMissingTableError(error)) {
      return {
        id: SECURITY_DEPOSIT_CONFIG_KEY,
        telegramId: DEFAULT_ADMIN_TELEGRAM_ID,
        adminBalance: DEFAULT_ADMIN_BALANCE,
      };
    }

    if (isMissingColumnError(error, "admin_balance")) {
      const fallbackResponse = await supabase
        .from(DEPOSIT_PAYMENT_SETTINGS_TABLE)
        .select("config_key, admin_telegram_id")
        .eq("config_key", SECURITY_DEPOSIT_CONFIG_KEY)
        .maybeSingle();

      if (fallbackResponse.error) {
        throw fallbackResponse.error;
      }

      const fallbackRow = fallbackResponse.data as {
        config_key: string;
        admin_telegram_id: string | null;
      } | null;

      return {
        id: fallbackRow?.config_key || SECURITY_DEPOSIT_CONFIG_KEY,
        telegramId: normalizeTelegramId(fallbackRow?.admin_telegram_id),
        adminBalance: DEFAULT_ADMIN_BALANCE,
      };
    }

    throw error;
  }

  const row = ((data || null) as DepositPaymentSettingsRow | null);

  return {
    id: row?.config_key || SECURITY_DEPOSIT_CONFIG_KEY,
    telegramId: normalizeTelegramId(row?.admin_telegram_id),
    adminBalance: normalizeAdminBalance(row?.admin_balance),
  };
}

export async function fetchAdminTelegramId() {
  const settings = await fetchAdminSettings();
  return settings.telegramId;
}

export async function updateAdminTelegramId(input: {
  id?: string;
  telegramId: string;
}) {
  const normalized = normalizeTelegramId(input.telegramId);
  const [depositConfig, currentSettings] = await Promise.all([
    fetchDepositConfiguration(),
    fetchAdminSettings(),
  ]);
  const { data, error } = await supabase
    .from(DEPOSIT_PAYMENT_SETTINGS_TABLE)
    .upsert(
      {
        config_key: input.id || SECURITY_DEPOSIT_CONFIG_KEY,
        admin_telegram_id: normalized,
        admin_balance: currentSettings.adminBalance,
        upi_id: depositConfig.upiId,
        bank_account_number: depositConfig.bankTransfer.accountNumber,
        bank_ifsc_code: depositConfig.bankTransfer.ifscCode,
        bank_name: depositConfig.bankTransfer.bankName,
        is_active: true,
      },
      {
        onConflict: "config_key",
      }
    )
    .select("config_key, admin_telegram_id")
    .single();

  if (error) {
    if (isMissingTableError(error)) {
      throw new Error(
        "Please create the deposit payment settings table in Supabase first."
      );
    }

    throw new Error(error.message || "Unable to save admin Telegram ID.");
  }

  return {
    id: data.config_key,
    telegramId: normalizeTelegramId(data.admin_telegram_id),
    adminBalance: DEFAULT_ADMIN_BALANCE,
  };
}

export async function updateAdminBalance(input: {
  id?: string;
  adminBalance: number;
}) {
  const normalizedBalance = normalizeAdminBalance(input.adminBalance);
  const [depositConfig, currentSettings] = await Promise.all([
    fetchDepositConfiguration(),
    fetchAdminSettings(),
  ]);
  const { data, error } = await supabase
    .from(DEPOSIT_PAYMENT_SETTINGS_TABLE)
    .upsert(
      {
        config_key: input.id || SECURITY_DEPOSIT_CONFIG_KEY,
        admin_balance: normalizedBalance,
        admin_telegram_id: currentSettings.telegramId,
        upi_id: depositConfig.upiId,
        bank_account_number: depositConfig.bankTransfer.accountNumber,
        bank_ifsc_code: depositConfig.bankTransfer.ifscCode,
        bank_name: depositConfig.bankTransfer.bankName,
        is_active: true,
      },
      {
        onConflict: "config_key",
      }
    )
    .select("config_key, admin_telegram_id, admin_balance")
    .single();

  if (error) {
    if (isMissingTableError(error)) {
      throw new Error(
        "Please create the deposit payment settings table in Supabase first."
      );
    }

    if (isMissingColumnError(error, "admin_balance")) {
      throw new Error(
        "Please add the admin_balance column to deposit_payment_settings before saving the dashboard balance."
      );
    }

    throw new Error(error.message || "Unable to save admin balance.");
  }

  return {
    id: data.config_key,
    telegramId: normalizeTelegramId(data.admin_telegram_id),
    adminBalance: normalizeAdminBalance(data.admin_balance),
  };
}
