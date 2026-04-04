import { supabase } from "@/lib/supabase";

export type SmsForwardingRule = {
  id: string;
  bankName: string | null;
  senderPattern: string;
  bodyPattern: string;
  messageType: "otp" | "verification";
  priority: number;
};

type SmsForwardingRuleRow = {
  id: string;
  bank_name: string | null;
  sender_pattern: string;
  body_pattern: string;
  message_type: "otp" | "verification";
  priority: number | null;
};

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
    } satisfies SmsForwardingRule;
  });
}
