import { supabase } from "@/lib/supabase";

type DepositPaymentSettingsRow = {
  admin_telegram_id: string | null;
  config_key: string;
};

const DEPOSIT_PAYMENT_SETTINGS_TABLE = "deposit_payment_settings";
const SECURITY_DEPOSIT_CONFIG_KEY = "security_deposit";
export const DEFAULT_ADMIN_TELEGRAM_ID = "@arbitrapay_admin";

function isMissingTableError(error: { code?: string; message?: string } | null) {
  return error?.code === "42P01" || error?.message?.includes("does not exist");
}

function normalizeTelegramId(value?: string | null) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return DEFAULT_ADMIN_TELEGRAM_ID;
  }

  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

export function buildTelegramUrl(telegramId?: string | null) {
  const normalized = normalizeTelegramId(telegramId);

  return `https://t.me/${normalized.replace(/^@/, "")}`;
}

export async function fetchAdminSettings() {
  const { data, error } = await supabase
    .from(DEPOSIT_PAYMENT_SETTINGS_TABLE)
    .select("config_key, admin_telegram_id")
    .eq("config_key", SECURITY_DEPOSIT_CONFIG_KEY)
    .maybeSingle();

  if (error) {
    if (isMissingTableError(error)) {
      return {
        id: SECURITY_DEPOSIT_CONFIG_KEY,
        telegramId: DEFAULT_ADMIN_TELEGRAM_ID,
      };
    }

    throw error;
  }

  const row = ((data || null) as DepositPaymentSettingsRow | null);

  return {
    id: row?.config_key || SECURITY_DEPOSIT_CONFIG_KEY,
    telegramId: normalizeTelegramId(row?.admin_telegram_id),
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
  const { data, error } = await supabase
    .from(DEPOSIT_PAYMENT_SETTINGS_TABLE)
    .update({
      admin_telegram_id: normalized,
    })
    .eq("config_key", input.id || SECURITY_DEPOSIT_CONFIG_KEY)
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
  };
}
