import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrentAppVersion } from "@/lib/appIdentity";
import { supabase } from "@/lib/supabase";

export type AppVersionPolicy = {
  id: string;
  platform: "android" | "ios" | "web";
  channel: string;
  latestVersion: string;
  minimumSupportedVersion: string;
  blockedVersions: string[];
  hardBlock: boolean;
  title: string;
  message: string;
  updateUrl: string | null;
  isActive: boolean;
};

const APP_VERSION_POLICY_CACHE_PREFIX = "app_version_policy_v1";

type AppVersionPolicyRow = {
  id: string;
  platform: "android" | "ios" | "web";
  channel: string;
  latest_version: string;
  minimum_supported_version: string;
  blocked_versions: string[] | null;
  hard_block: boolean | null;
  title: string | null;
  message: string | null;
  update_url: string | null;
  is_active: boolean | null;
};

function getAppVersionPolicyCacheKey(platform: "android" | "ios" | "web", channel = "production") {
  return `${APP_VERSION_POLICY_CACHE_PREFIX}:${platform}:${channel}`;
}

export function compareVersions(left: string, right: string) {
  const leftParts = left.split(".").map((part) => Number(part.replace(/\D/g, "")) || 0);
  const rightParts = right.split(".").map((part) => Number(part.replace(/\D/g, "")) || 0);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = leftParts[index] || 0;
    const rightValue = rightParts[index] || 0;

    if (leftValue > rightValue) {
      return 1;
    }

    if (leftValue < rightValue) {
      return -1;
    }
  }

  return 0;
}

export function evaluateAppVersionPolicy(
  currentVersion: string,
  policy: AppVersionPolicy | null
) {
  if (!policy) {
    return {
      isSupported: true,
      requiresUpdate: false,
      isHardBlocked: false,
    };
  }

  const isExplicitlyBlocked = policy.blockedVersions.includes(currentVersion);
  const isBelowMinimum =
    compareVersions(currentVersion, policy.minimumSupportedVersion) < 0;
  const requiresUpdate =
    compareVersions(currentVersion, policy.latestVersion) < 0;
  const isSupported = !isExplicitlyBlocked && !isBelowMinimum;

  return {
    isSupported,
    requiresUpdate,
    isHardBlocked: !isSupported && policy.hardBlock,
  };
}

export async function fetchActiveAppVersionPolicy(platform: "android" | "ios" | "web") {
  const { data, error } = await supabase
    .from("app_version_control")
    .select(
      "id, platform, channel, latest_version, minimum_supported_version, blocked_versions, hard_block, title, message, update_url, is_active"
    )
    .eq("platform", platform)
    .eq("channel", "production")
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const row = data as AppVersionPolicyRow;

  return {
    id: row.id,
    platform: row.platform,
    channel: row.channel,
    latestVersion: row.latest_version,
    minimumSupportedVersion: row.minimum_supported_version,
    blockedVersions: row.blocked_versions || [],
    hardBlock: Boolean(row.hard_block),
    title: row.title?.trim() || "Update Required",
    message:
      row.message?.trim() ||
      "This version is no longer supported. Please install the latest version.",
    updateUrl: row.update_url,
    isActive: Boolean(row.is_active),
  } satisfies AppVersionPolicy;
}

export async function getCachedAppVersionPolicy(
  platform: "android" | "ios" | "web",
  channel = "production"
) {
  const rawPolicy = await AsyncStorage.getItem(
    getAppVersionPolicyCacheKey(platform, channel)
  );

  if (!rawPolicy) {
    return null;
  }

  try {
    const parsedPolicy = JSON.parse(rawPolicy) as AppVersionPolicy;

    if (!parsedPolicy?.id || !parsedPolicy?.minimumSupportedVersion) {
      return null;
    }

    return parsedPolicy;
  } catch {
    return null;
  }
}

export async function cacheActiveAppVersionPolicy(policy: AppVersionPolicy) {
  await AsyncStorage.setItem(
    getAppVersionPolicyCacheKey(policy.platform, policy.channel),
    JSON.stringify(policy)
  );
}

export async function clearCachedAppVersionPolicy(
  platform: "android" | "ios" | "web",
  channel = "production"
) {
  await AsyncStorage.removeItem(getAppVersionPolicyCacheKey(platform, channel));
}
