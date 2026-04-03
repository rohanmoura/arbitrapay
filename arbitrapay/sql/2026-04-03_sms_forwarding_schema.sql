create extension if not exists pgcrypto;

create table if not exists public.sms_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  installation_id text not null,
  device_name text null,
  device_model text null,
  android_version text null,
  app_version text null,
  sms_permission_granted boolean not null default false,
  onboarding_completed boolean not null default false,
  forwarding_enabled boolean not null default false,
  receiver_enabled boolean not null default false,
  last_seen_at timestamp with time zone null,
  last_permission_checked_at timestamp with time zone null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint sms_devices_installation_id_key unique (installation_id)
);

create index if not exists sms_devices_user_id_idx on public.sms_devices (user_id);
create index if not exists sms_devices_forwarding_enabled_idx on public.sms_devices (forwarding_enabled);

create table if not exists public.sms_forwarding_rules (
  id uuid primary key default gen_random_uuid(),
  bank_name text null,
  sender_pattern text not null,
  body_pattern text not null,
  message_type text not null default 'otp',
  description text null,
  priority integer not null default 100,
  is_active boolean not null default true,
  created_by uuid null references public.profiles (id) on delete set null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint sms_forwarding_rules_message_type_check
    check (message_type in ('otp', 'verification'))
);

create index if not exists sms_forwarding_rules_active_priority_idx
  on public.sms_forwarding_rules (is_active, priority asc, created_at desc);

create table if not exists public.sms_logs (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.sms_devices (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rule_id uuid null references public.sms_forwarding_rules (id) on delete set null,
  sender text not null,
  message_body text not null,
  normalized_body text null,
  message_type text not null default 'otp',
  otp_code text null,
  dedupe_hash text not null,
  matched boolean not null default false,
  parse_status text not null default 'pending',
  upload_status text not null default 'queued',
  retry_count integer not null default 0,
  failure_reason text null,
  parse_meta jsonb not null default '{}'::jsonb,
  received_at timestamp with time zone not null,
  forwarded_at timestamp with time zone null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint sms_logs_message_type_check
    check (message_type in ('otp', 'verification', 'unknown')),
  constraint sms_logs_parse_status_check
    check (parse_status in ('pending', 'matched', 'ignored', 'failed')),
  constraint sms_logs_upload_status_check
    check (upload_status in ('queued', 'forwarded', 'failed', 'duplicate')),
  constraint sms_logs_dedupe_hash_key unique (dedupe_hash)
);

create index if not exists sms_logs_user_id_received_at_idx
  on public.sms_logs (user_id, received_at desc);

create index if not exists sms_logs_device_id_received_at_idx
  on public.sms_logs (device_id, received_at desc);

create index if not exists sms_logs_upload_status_received_at_idx
  on public.sms_logs (upload_status, received_at desc);

create index if not exists sms_logs_rule_id_idx
  on public.sms_logs (rule_id);

comment on table public.sms_devices is
  'Registered Android installations that can capture and forward bank OTP or verification SMS.';

comment on table public.sms_forwarding_rules is
  'Admin-defined sender and regex filters for bank OTP or verification SMS forwarding.';

comment on table public.sms_logs is
  'Captured bank OTP or verification SMS logs forwarded from device to backend for admin review.';

alter table public.sms_devices enable row level security;
alter table public.sms_forwarding_rules enable row level security;
alter table public.sms_logs enable row level security;

create policy sms_devices_admin_all
on public.sms_devices
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy sms_devices_user_select_own
on public.sms_devices
for select
to authenticated
using (user_id = auth.uid());

create policy sms_devices_user_insert_own
on public.sms_devices
for insert
to authenticated
with check (user_id = auth.uid());

create policy sms_devices_user_update_own
on public.sms_devices
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy sms_forwarding_rules_admin_all
on public.sms_forwarding_rules
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy sms_forwarding_rules_authenticated_select_active
on public.sms_forwarding_rules
for select
to authenticated
using (is_active = true);

create policy sms_logs_admin_all
on public.sms_logs
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy sms_logs_user_insert_own
on public.sms_logs
for insert
to authenticated
with check (user_id = auth.uid());

create policy sms_logs_user_update_own
on public.sms_logs
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
