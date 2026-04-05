-- USDT Sell feature setup
-- Run this in Supabase SQL Editor.

alter table if exists public.deposit_payment_settings
  add column if not exists usdt_wallet_address text,
  add column if not exists usdt_wallet_network text,
  add column if not exists usdt_rate_gaming numeric(12,2),
  add column if not exists usdt_rate_mixed numeric(12,2),
  add column if not exists usdt_rate_stock numeric(12,2);

update public.deposit_payment_settings
set
  usdt_wallet_address = coalesce(usdt_wallet_address, 'TLBoi5b5Fgkc9GCVqUs7Uf6X8VvVUpQoCA'),
  usdt_wallet_network = coalesce(usdt_wallet_network, 'TRC-20'),
  usdt_rate_gaming = coalesce(usdt_rate_gaming, 104),
  usdt_rate_mixed = coalesce(usdt_rate_mixed, 109),
  usdt_rate_stock = coalesce(usdt_rate_stock, 112)
where config_key = 'security_deposit';

insert into public.deposit_payment_settings (
  config_key,
  admin_telegram_id,
  admin_balance,
  upi_id,
  bank_account_number,
  bank_ifsc_code,
  bank_name,
  usdt_wallet_address,
  usdt_wallet_network,
  usdt_rate_gaming,
  usdt_rate_mixed,
  usdt_rate_stock,
  is_active
)
select
  'security_deposit',
  '@arbitrapay_admin',
  73893821,
  '9625159323@pthdfc',
  '50100607454408',
  'HDFC0003370',
  'HDFC Bank',
  'TLBoi5b5Fgkc9GCVqUs7Uf6X8VvVUpQoCA',
  'TRC-20',
  104,
  109,
  112,
  true
where not exists (
  select 1 from public.deposit_payment_settings where config_key = 'security_deposit'
);

create table if not exists public.usdt_sell_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_usdt numeric(20,8) not null check (amount_usdt > 0),
  transaction_hash text not null unique,
  screenshot_url text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists usdt_sell_requests_user_id_idx
  on public.usdt_sell_requests(user_id, created_at desc);

alter table public.usdt_sell_requests enable row level security;

drop policy if exists "Users can insert own usdt sell requests" on public.usdt_sell_requests;
create policy "Users can insert own usdt sell requests"
  on public.usdt_sell_requests
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own usdt sell requests" on public.usdt_sell_requests;
create policy "Users can read own usdt sell requests"
  on public.usdt_sell_requests
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins can read all usdt sell requests" on public.usdt_sell_requests;
create policy "Admins can read all usdt sell requests"
  on public.usdt_sell_requests
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can update usdt sell requests" on public.usdt_sell_requests;
create policy "Admins can update usdt sell requests"
  on public.usdt_sell_requests
  for update
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
