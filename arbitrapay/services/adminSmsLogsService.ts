import { supabase } from "@/lib/supabase";

type SmsLogProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  role: "user" | "admin" | null;
};

type SmsLogDeviceRow = {
  id: string;
  installation_id: string | null;
  device_name: string | null;
  app_version: string | null;
};

type SmsLogRuleRow = {
  id: string;
  bank_name: string | null;
  message_type: string | null;
};

type RawAdminSmsLogRow = {
  id: string;
  user_id: string | null;
  device_id: string | null;
  rule_id: string | null;
  sender: string | null;
  message_body: string | null;
  normalized_body: string | null;
  message_type: string | null;
  otp_code: string | null;
  dedupe_hash: string | null;
  matched: boolean | null;
  parse_status: string | null;
  upload_status: string | null;
  retry_count: number | null;
  failure_reason: string | null;
  parse_meta: Record<string, any> | null;
  received_at: string | null;
  forwarded_at: string | null;
  created_at: string | null;
  profiles: SmsLogProfileRow | SmsLogProfileRow[] | null;
  sms_devices: SmsLogDeviceRow | SmsLogDeviceRow[] | null;
  sms_forwarding_rules: SmsLogRuleRow | SmsLogRuleRow[] | null;
};

export type AdminSmsLog = {
  id: string;
  sender: string;
  messageBody: string;
  normalizedBody: string | null;
  messageType: string;
  otpCode: string | null;
  dedupeHash: string;
  matched: boolean;
  parseStatus: string;
  uploadStatus: string;
  retryCount: number;
  failureReason: string | null;
  receivedAt: string | null;
  forwardedAt: string | null;
  createdAt: string | null;
  bankName: string | null;
  matchedAccountSuffix: string | null;
  user: {
    id: string;
    email: string | null;
    name: string | null;
  };
  device: {
    id: string;
    installationId: string | null;
    deviceName: string | null;
    appVersion: string | null;
  };
  rule: {
    id: string | null;
    messageType: string | null;
  };
};

function getSingleRow<T>(value: T | T[] | null) {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] || null : value;
}

export async function fetchAdminSmsLogs(limit = 100) {
  const { data, error } = await supabase
    .from("sms_logs")
    .select(
      `
      id,
      user_id,
      device_id,
      rule_id,
      sender,
      message_body,
      normalized_body,
      message_type,
      otp_code,
      dedupe_hash,
      matched,
      parse_status,
      upload_status,
      retry_count,
      failure_reason,
      parse_meta,
      received_at,
      forwarded_at,
      created_at,
      profiles!sms_logs_user_id_fkey (
        id,
        email,
        name,
        role
      ),
      sms_devices!sms_logs_device_id_fkey (
        id,
        installation_id,
        device_name,
        app_version
      ),
      sms_forwarding_rules!sms_logs_rule_id_fkey (
        id,
        bank_name,
        message_type
      )
    `
    )
    .order("received_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return ((data || []) as RawAdminSmsLogRow[])
    .map((row) => {
      const profile = getSingleRow(row.profiles);
      const device = getSingleRow(row.sms_devices);
      const rule = getSingleRow(row.sms_forwarding_rules);

      if (!row.user_id || !row.device_id || !profile || profile.role !== "user" || !device) {
        return null;
      }

      return {
        id: row.id,
        sender: row.sender || "Unknown sender",
        messageBody: row.message_body || "",
        normalizedBody: row.normalized_body,
        messageType: row.message_type || "otp",
        otpCode: row.otp_code,
        dedupeHash: row.dedupe_hash || "",
        matched: Boolean(row.matched),
        parseStatus: row.parse_status || "pending",
        uploadStatus: row.upload_status || "queued",
        retryCount: row.retry_count ?? 0,
        failureReason: row.failure_reason,
        receivedAt: row.received_at,
        forwardedAt: row.forwarded_at,
        createdAt: row.created_at,
        bankName:
          rule?.bank_name ||
          (typeof row.parse_meta?.bankName === "string" ? row.parse_meta.bankName : null),
        matchedAccountSuffix:
          typeof row.parse_meta?.matchedAccountSuffix === "string"
            ? row.parse_meta.matchedAccountSuffix
            : null,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
        },
        device: {
          id: device.id,
          installationId: device.installation_id,
          deviceName: device.device_name,
          appVersion: device.app_version,
        },
        rule: {
          id: rule?.id || row.rule_id,
          messageType: rule?.message_type || null,
        },
      } satisfies AdminSmsLog;
    })
    .filter(Boolean) as AdminSmsLog[];
}
