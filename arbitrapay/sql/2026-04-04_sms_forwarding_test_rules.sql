insert into public.sms_forwarding_rules (
  bank_name,
  sender_pattern,
  body_pattern,
  message_type,
  description,
  priority,
  is_active
)
values
(
  'HDFC Bank',
  '(?i)(HDFC|VK-HDFCBK|AD-HDFCBK|TESTBANK|.*)',
  '(?i)(otp|verification code|login code|secure code).*(\d{4,8})',
  'otp',
  'Generic HDFC-style OTP and verification rule for testing and early rollout.',
  10,
  true
),
(
  'ICICI Bank',
  '(?i)(ICICI|VK-ICICIB|AD-ICICIB|TESTBANK|.*)',
  '(?i)(otp|verification code|beneficiary|upi verification).*(\d{4,8})',
  'otp',
  'Generic ICICI-style OTP and verification rule for testing and early rollout.',
  20,
  true
),
(
  'State Bank of India',
  '(?i)(SBI|SBIINB|VK-SBIINB|AD-SBIINB|TESTBANK|.*)',
  '(?i)(otp|high security password|verification).*(\d{4,8})',
  'otp',
  'Generic SBI-style OTP and verification rule for testing and early rollout.',
  30,
  true
)
on conflict do nothing;
