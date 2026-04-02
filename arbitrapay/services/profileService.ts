import { supabase } from "@/lib/supabase";

export const DEFAULT_PROFILE_NAME = "User";
export const DEFAULT_PROFILE_EMAIL = "user@email.com";
export const DEFAULT_PROFILE_DISPLAY_NAME = "Agent";

export type ProfileRecord = {
  avatar: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  telegram_id: string | null;
};

export type ProfileAccessRecord = {
  id: string;
  email: string | null;
  role: "user" | "admin" | null;
  status: string | null;
};

export type UpdateProfileInput = {
  avatar?: string | null;
  name?: string | null;
  phone?: string | null;
  telegram_id?: string | null;
};

export function hasTelegramId(value?: string | null) {
  return Boolean(value?.trim());
}

export function getProfileDisplayName(
  name?: string | null,
  fallback = DEFAULT_PROFILE_DISPLAY_NAME
) {
  const trimmed = name?.trim();

  if (!trimmed || trimmed === DEFAULT_PROFILE_NAME) {
    return fallback;
  }

  return trimmed;
}

export async function fetchProfile(userId: string, fallbackEmail?: string | null) {
  const { data, error } = await supabase
    .from("profiles")
    .select("avatar, email, name, phone, telegram_id")
    .eq("id", userId)
    .maybeSingle<ProfileRecord>();

  if (error) {
    throw error;
  }

  if (data) {
    return data;
  }

  const { data: createdProfile, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      email: fallbackEmail ?? DEFAULT_PROFILE_EMAIL,
    })
    .select("avatar, email, name, phone, telegram_id")
    .single<ProfileRecord>();

  if (insertError) {
    throw insertError;
  }

  return createdProfile;
}

export async function updateProfile(userId: string, updates: UpdateProfileInput) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("avatar, email, name, phone, telegram_id")
    .single<ProfileRecord>();

  if (error) {
    throw error;
  }

  return data;
}

export function isProfileSuspended(status?: string | null) {
  return status?.trim().toLowerCase() === "suspended";
}

export async function fetchProfileAccessByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, status")
    .ilike("email", normalizedEmail)
    .maybeSingle<ProfileAccessRecord>();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchProfileAccessById(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, status")
    .eq("id", userId)
    .maybeSingle<ProfileAccessRecord>();

  if (error) {
    throw error;
  }

  return data;
}
