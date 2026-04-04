create extension if not exists pgcrypto;

create table if not exists public.app_version_control (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  channel text not null default 'production',
  latest_version text not null,
  minimum_supported_version text not null,
  blocked_versions text[] not null default '{}',
  hard_block boolean not null default true,
  title text not null default 'Update Required',
  message text not null default 'This version is no longer supported. Please install the latest version.',
  update_url text null,
  is_active boolean not null default true,
  created_by uuid null references public.profiles (id) on delete set null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint app_version_control_platform_check
    check (platform in ('android', 'ios', 'web')),
  constraint app_version_control_channel_platform_key
    unique (platform, channel)
);

create index if not exists app_version_control_active_idx
  on public.app_version_control (platform, channel, is_active);

alter table public.app_version_control enable row level security;

create policy app_version_control_admin_all
on public.app_version_control
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

create policy app_version_control_public_select_active
on public.app_version_control
for select
to anon, authenticated
using (is_active = true);

comment on table public.app_version_control is
  'Remote version policy used to hard-block or update deprecated APK builds.';
