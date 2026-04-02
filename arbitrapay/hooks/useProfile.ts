import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { handleLogout } from "@/lib/logout";
import {
  DEFAULT_PROFILE_EMAIL,
  DEFAULT_PROFILE_NAME,
  fetchProfile,
  getProfileDisplayName,
  updateProfile,
} from "@/services/profileService";
import { pickImageFromGallery, uploadProfileAvatar } from "@/utils/imageUpload";

type ProfileFormState = {
  avatar: string | null;
  email: string;
  name: string;
  phone: string;
  telegramId: string;
};

const PHONE_DIGIT_LIMIT = 10;

function normalizePhone(phone: string | null | undefined) {
  if (!phone) {
    return "";
  }

  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("91") && digits.length > PHONE_DIGIT_LIMIT) {
    return digits.slice(-PHONE_DIGIT_LIMIT);
  }

  return digits.slice(0, PHONE_DIGIT_LIMIT);
}

function mapProfileToForm(profile: {
  avatar: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  telegram_id: string | null;
}): ProfileFormState {
  return {
    avatar: profile.avatar,
    email: profile.email || DEFAULT_PROFILE_EMAIL,
    name: getProfileDisplayName(profile.name),
    phone: normalizePhone(profile.phone),
    telegramId: profile.telegram_id?.trim() || "",
  };
}

export function useProfile() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<ProfileFormState>({
    avatar: null,
    email: DEFAULT_PROFILE_EMAIL,
    name: DEFAULT_PROFILE_NAME,
    phone: "",
    telegramId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await fetchProfile(session.user.id, session.user.email);
      setProfile(mapProfileToForm(data));
    } catch (error: any) {
      Alert.alert("Profile Error", error.message || "Unable to load profile.");
      setProfile((current) => ({
        ...current,
        email: session.user.email || DEFAULT_PROFILE_EMAIL,
      }));
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email, session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const setName = useCallback((name: string) => {
    setProfile((current) => ({ ...current, name }));
  }, []);

  const setPhone = useCallback((phone: string) => {
    const cleaned = phone.replace(/\D/g, "").slice(0, PHONE_DIGIT_LIMIT);
    setProfile((current) => ({ ...current, phone: cleaned }));
  }, []);

  const setTelegramId = useCallback((telegramId: string) => {
    setProfile((current) => ({ ...current, telegramId }));
  }, []);

  const pickAvatar = useCallback(async () => {
    if (!session?.user?.id || uploadingAvatar || saving) {
      return;
    }

    setUploadingAvatar(true);

    try {
      const imageUri = await pickImageFromGallery();

      if (!imageUri) {
        return;
      }

      const avatarUrl = await uploadProfileAvatar(session.user.id, imageUri);
      const updatedProfile = await updateProfile(session.user.id, {
        avatar: avatarUrl,
      });

      setProfile(mapProfileToForm(updatedProfile));
    } catch (error: any) {
      Alert.alert(
        "Avatar Error",
        error.message || "Unable to update your profile picture."
      );
    } finally {
      setUploadingAvatar(false);
    }
  }, [saving, session?.user?.id, uploadingAvatar]);

  const saveProfile = useCallback(async () => {
    if (!session?.user?.id || saving || uploadingAvatar) {
      return;
    }

    setSaving(true);

    try {
      const updatedProfile = await updateProfile(session.user.id, {
        avatar: profile.avatar,
        name: profile.name.trim() || DEFAULT_PROFILE_NAME,
        phone: profile.phone || null,
        telegram_id: profile.telegramId.trim() || null,
      });

      setProfile(mapProfileToForm(updatedProfile));
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error: any) {
      Alert.alert("Save Error", error.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }, [profile.avatar, profile.name, profile.phone, profile.telegramId, saving, session?.user?.id, uploadingAvatar]);

  const logout = useCallback(async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      await handleLogout();
    } finally {
      setLoggingOut(false);
    }
  }, [loggingOut]);

  return {
    profile,
    loading,
    saving,
    loggingOut,
    uploadingAvatar,
    setName,
    setPhone,
    setTelegramId,
    saveProfile,
    pickAvatar,
    logout,
  };
}
