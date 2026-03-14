import { supabase } from "@/lib/supabase";

export const DEFAULT_PROFILE_NAME = "User";
export const DEFAULT_PROFILE_EMAIL = "user@email.com";

export type ProfileRecord = {
  avatar: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
};

export type UpdateProfileInput = {
  avatar?: string | null;
  name?: string | null;
  phone?: string | null;
};

export async function fetchProfile(userId: string, fallbackEmail?: string | null) {
  const { data, error } = await supabase
    .from("profiles")
    .select("avatar, email, name, phone")
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
    .select("avatar, email, name, phone")
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
    .select("avatar, email, name, phone")
    .single<ProfileRecord>();

  if (error) {
    throw error;
  }

  return data;
}
