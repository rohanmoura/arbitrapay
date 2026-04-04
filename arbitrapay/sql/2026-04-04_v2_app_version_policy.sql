insert into public.app_version_control (
  platform,
  channel,
  latest_version,
  minimum_supported_version,
  blocked_versions,
  hard_block,
  title,
  message,
  update_url,
  is_active
)
values (
  'android',
  'production',
  '2.0.0',
  '2.0.0',
  array['1.0.0'],
  true,
  'App Update Required',
  'A new version of ArbitraPay is available. Please uninstall this app and install the latest APK. Your data is safe. For help, contact admin on Telegram: @arbitrapay_admin.',
  'https://t.me/arbitrapay_admin',
  true
)
on conflict (platform, channel)
do update set
  latest_version = excluded.latest_version,
  minimum_supported_version = excluded.minimum_supported_version,
  blocked_versions = excluded.blocked_versions,
  hard_block = excluded.hard_block,
  title = excluded.title,
  message = excluded.message,
  update_url = excluded.update_url,
  is_active = excluded.is_active,
  updated_at = timezone('utc'::text, now());
