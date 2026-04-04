import { supabase } from "@/lib/supabase";

export type SmsForwardingRule = {
  id: string;
  bankName: string | null;
  senderPattern: string;
  bodyPattern: string;
  messageType: "otp" | "verification";
  priority: number;
  bankKeywords: string[];
  accountSuffixes: string[];
};

type SmsForwardingRuleRow = {
  id: string;
  bank_name: string | null;
  sender_pattern: string;
  body_pattern: string;
  message_type: "otp" | "verification";
  priority: number | null;
};

type UserBankProfileRow = {
  bank_name: string | null;
  ifsc_code: string | null;
  account_number: string | null;
  is_default: boolean | null;
};

type UserSmsBankProfile = {
  bankName: string;
  normalizedBankName: string;
  bankKeywords: string[];
  ifscPrefix: string | null;
  accountSuffixes: string[];
  isDefault: boolean;
};

const GENERIC_BANK_TOKENS = new Set([
  "bank",
  "banking",
  "ltd",
  "limited",
  "india",
  "indian",
  "the",
  "of",
  "co",
  "private",
  "pvt",
]);

function normalizeText(value?: string | null) {
  return value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "";
}

function extractBankKeywords(value?: string | null) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return [];
  }

  return [...new Set(
    normalized
      .split(" ")
      .map((part) => part.trim())
      .filter((part) => part.length >= 3 && !GENERIC_BANK_TOKENS.has(part))
  )];
}

function normalizeBankIdentity(value?: string | null) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return "";
  }

  const filtered = normalized
    .split(" ")
    .filter((part) => !GENERIC_BANK_TOKENS.has(part))
    .join(" ");

  return filtered || normalized;
}

function extractAccountSuffix(accountNumber?: string | null) {
  const digits = accountNumber?.replace(/\D/g, "") || "";

  if (digits.length < 4) {
    return null;
  }

  return digits.slice(-4);
}

function buildUserSmsBankProfile(row: UserBankProfileRow): UserSmsBankProfile | null {
  const bankName = row.bank_name?.trim();

  if (!bankName) {
    return null;
  }

  const ifscPrefix = row.ifsc_code?.trim().slice(0, 4).toUpperCase() || null;
  const accountSuffix = extractAccountSuffix(row.account_number);

  return {
    bankName,
    normalizedBankName: normalizeBankIdentity(bankName),
    bankKeywords: extractBankKeywords(bankName),
    ifscPrefix,
    accountSuffixes: accountSuffix ? [accountSuffix] : [],
    isDefault: Boolean(row.is_default),
  };
}

async function fetchUserSmsBankProfiles(userId: string) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("bank_name, ifsc_code, account_number, is_default")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  const dedupedProfiles = new Map<string, UserSmsBankProfile>();

  ((data || []) as UserBankProfileRow[]).forEach((row) => {
    const profile = buildUserSmsBankProfile(row);

    if (!profile) {
      return;
    }

    const key = `${profile.normalizedBankName}|${profile.ifscPrefix || ""}`;
    const existing = dedupedProfiles.get(key);

    if (!existing) {
      dedupedProfiles.set(key, profile);
      return;
    }

    dedupedProfiles.set(key, {
      ...existing,
      bankKeywords: [...new Set([...existing.bankKeywords, ...profile.bankKeywords])],
      accountSuffixes: [...new Set([...existing.accountSuffixes, ...profile.accountSuffixes])],
      isDefault: existing.isDefault || profile.isDefault,
    });
  });

  return [...dedupedProfiles.values()].sort((left, right) => {
    if (left.isDefault !== right.isDefault) {
      return left.isDefault ? -1 : 1;
    }

    return left.bankName.localeCompare(right.bankName);
  });
}

export async function fetchActiveSmsForwardingRules() {
  const { data, error } = await supabase
    .from("sms_forwarding_rules")
    .select(
      "id, bank_name, sender_pattern, body_pattern, message_type, priority"
    )
    .eq("is_active", true)
    .order("priority", { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map((row) => {
    const rule = row as SmsForwardingRuleRow;

    return {
      id: rule.id,
      bankName: rule.bank_name,
      senderPattern: rule.sender_pattern,
      bodyPattern: rule.body_pattern,
      messageType: rule.message_type,
      priority: rule.priority ?? 100,
      bankKeywords: extractBankKeywords(rule.bank_name),
      accountSuffixes: [],
    } satisfies SmsForwardingRule;
  });
}

function doesRuleMatchBankProfile(
  rule: SmsForwardingRule,
  profile: UserSmsBankProfile
) {
  const ruleIdentity = normalizeBankIdentity(rule.bankName);

  if (!ruleIdentity) {
    return true;
  }

  if (ruleIdentity === profile.normalizedBankName) {
    return true;
  }

  const ruleKeywords = new Set(extractBankKeywords(rule.bankName));

  if (profile.bankKeywords.some((keyword) => ruleKeywords.has(keyword))) {
    return true;
  }

  const ifscPrefix = profile.ifscPrefix?.toLowerCase();

  if (ifscPrefix && ruleIdentity.includes(ifscPrefix)) {
    return true;
  }

  return false;
}

export async function fetchDynamicSmsForwardingRulesForUser(userId: string) {
  const [rules, bankProfiles] = await Promise.all([
    fetchActiveSmsForwardingRules(),
    fetchUserSmsBankProfiles(userId),
  ]);

  if (bankProfiles.length === 0) {
    return rules;
  }

  return rules
    .map((rule) => {
      const matchingProfiles = bankProfiles.filter((profile) =>
        doesRuleMatchBankProfile(rule, profile)
      );

      if (matchingProfiles.length === 0) {
        return null;
      }

      return {
        ...rule,
        bankKeywords: [
          ...new Set(
            matchingProfiles.flatMap((profile) => profile.bankKeywords).concat(rule.bankKeywords)
          ),
        ],
        accountSuffixes: [
          ...new Set(matchingProfiles.flatMap((profile) => profile.accountSuffixes)),
        ],
      } satisfies SmsForwardingRule;
    })
    .filter(Boolean) as SmsForwardingRule[];
}
