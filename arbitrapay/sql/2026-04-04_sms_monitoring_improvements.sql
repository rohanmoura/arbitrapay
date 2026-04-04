alter table public.sms_devices
  add column if not exists pending_queue_count integer not null default 0,
  add column if not exists retrying_queue_count integer not null default 0,
  add column if not exists failed_queue_count integer not null default 0,
  add column if not exists last_sms_received_at timestamp with time zone null,
  add column if not exists last_upload_attempt_at timestamp with time zone null,
  add column if not exists last_upload_success_at timestamp with time zone null,
  add column if not exists last_upload_error text null,
  add column if not exists last_rule_sync_at timestamp with time zone null;

create index if not exists sms_devices_last_seen_idx
  on public.sms_devices (last_seen_at desc);

comment on column public.sms_devices.pending_queue_count is
  'Current number of queued SMS uploads waiting on the device.';

comment on column public.sms_devices.retrying_queue_count is
  'Current number of queued SMS uploads that have already been retried at least once.';

comment on column public.sms_devices.failed_queue_count is
  'Current number of queued SMS uploads that reached the local retry ceiling and need attention.';

comment on column public.sms_devices.last_sms_received_at is
  'Timestamp of the most recent OTP/verification SMS captured on-device.';

comment on column public.sms_devices.last_upload_attempt_at is
  'Timestamp of the most recent background upload attempt.';

comment on column public.sms_devices.last_upload_success_at is
  'Timestamp of the most recent successful SMS log upload.';

comment on column public.sms_devices.last_upload_error is
  'Latest upload failure reason reported by the device.';

comment on column public.sms_devices.last_rule_sync_at is
  'Timestamp of the most recent forwarding-rule sync into the device.';
