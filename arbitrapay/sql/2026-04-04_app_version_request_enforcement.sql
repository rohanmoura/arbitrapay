create or replace function public.get_request_header_value(header_name text)
returns text
language sql
stable
as $$
  select value
  from jsonb_each_text(
    coalesce(current_setting('request.headers', true), '{}')::jsonb
  )
  where lower(key) = lower(header_name)
  limit 1;
$$;

create or replace function public.compare_app_versions(left_version text, right_version text)
returns integer
language plpgsql
immutable
as $$
declare
  left_parts text[] := string_to_array(regexp_replace(coalesce(left_version, ''), '[^0-9.]', '', 'g'), '.');
  right_parts text[] := string_to_array(regexp_replace(coalesce(right_version, ''), '[^0-9.]', '', 'g'), '.');
  left_value integer;
  right_value integer;
  max_parts integer := greatest(
    coalesce(array_length(left_parts, 1), 0),
    coalesce(array_length(right_parts, 1), 0)
  );
  idx integer;
begin
  if max_parts = 0 then
    return 0;
  end if;

  for idx in 1..max_parts loop
    left_value := coalesce(nullif(left_parts[idx], ''), '0')::integer;
    right_value := coalesce(nullif(right_parts[idx], ''), '0')::integer;

    if left_value > right_value then
      return 1;
    end if;

    if left_value < right_value then
      return -1;
    end if;
  end loop;

  return 0;
end;
$$;

create or replace function public.is_request_app_version_allowed()
returns boolean
language plpgsql
stable
as $$
declare
  request_platform text := lower(coalesce(public.get_request_header_value('x-app-platform'), ''));
  request_channel text := coalesce(nullif(public.get_request_header_value('x-app-channel'), ''), 'production');
  request_version text := coalesce(nullif(public.get_request_header_value('x-app-version'), ''), '');
  active_policy public.app_version_control%rowtype;
begin
  if request_platform = '' or request_version = '' then
    return false;
  end if;

  select *
  into active_policy
  from public.app_version_control
  where platform = request_platform
    and channel = request_channel
    and is_active = true
  limit 1;

  if not found then
    return true;
  end if;

  if request_version = any(active_policy.blocked_versions) then
    return false;
  end if;

  if public.compare_app_versions(
    request_version,
    active_policy.minimum_supported_version
  ) < 0 then
    return false;
  end if;

  return true;
end;
$$;

comment on function public.is_request_app_version_allowed() is
  'Rejects table access when the request app version is blocked, below minimum supported, or missing version headers.';

do $$
declare
  protected_table text;
  protected_tables text[] := array[
    'account_activations',
    'bank_accounts',
    'deposit_payment_settings',
    'live_deposits',
    'profiles',
    'security_deposits',
    'sms_devices',
    'sms_forwarding_rules',
    'sms_logs',
    'support_tickets',
    'transactions',
    'updates',
    'withdrawals'
  ];
begin
  foreach protected_table in array protected_tables loop
    if exists (
      select 1
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = protected_table
        and c.relkind = 'r'
        and c.relrowsecurity = true
    ) then
      execute format(
        'drop policy if exists app_version_enforcement on public.%I',
        protected_table
      );

      execute format(
        'create policy app_version_enforcement on public.%I as restrictive for all to public using (public.is_request_app_version_allowed()) with check (public.is_request_app_version_allowed())',
        protected_table
      );
    end if;
  end loop;
end
$$;
