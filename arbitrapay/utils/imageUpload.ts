import * as ImagePicker from "expo-image-picker";

import { supabase } from "@/lib/supabase";

const PROFILE_AVATAR_BUCKET =
  process.env.EXPO_PUBLIC_SUPABASE_AVATAR_BUCKET || "avatars";

export async function pickImageFromGallery() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error("Gallery permission is required to update your avatar.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.[0]?.uri) {
    return null;
  }

  return result.assets[0].uri;
}

export async function uploadProfileAvatar(userId: string, imageUri: string) {
  const response = await fetch(imageUri);
  const arrayBuffer = await response.arrayBuffer();
  const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${userId}/avatar.${fileExt}`;
  const contentType = fileExt === "png" ? "image/png" : "image/jpeg";

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_AVATAR_BUCKET)
    .upload(filePath, arrayBuffer, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PROFILE_AVATAR_BUCKET).getPublicUrl(filePath);

  return publicUrl;
}
