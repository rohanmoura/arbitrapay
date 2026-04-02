import {
  fetchAdminSettings,
  updateAdminTelegramId,
} from "@/services/adminSettingsService";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export function useAdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [settingsId, setSettingsId] = useState<string>("default");
  const [telegramId, setTelegramId] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);

    try {
      const settings = await fetchAdminSettings();
      setSettingsId(settings.id);
      setTelegramId(settings.telegramId);
    } catch (error: any) {
      Alert.alert(
        "Admin Settings Error",
        error.message || "Unable to load admin settings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadSettings();
    }, [loadSettings])
  );

  const startEditing = useCallback(() => {
    if (loading || saving) {
      return;
    }

    setEditing(true);
  }, [loading, saving]);

  const saveTelegramId = useCallback(async () => {
    if (!telegramId.trim() || saving) {
      if (!telegramId.trim()) {
        Alert.alert("Validation Error", "Telegram ID is required.");
      }
      return;
    }

    setSaving(true);

    try {
      const updated = await updateAdminTelegramId({
        id: settingsId,
        telegramId: telegramId.trim(),
      });

      setSettingsId(updated.id);
      setTelegramId(updated.telegramId);
      setEditing(false);
      Alert.alert("Saved", "Admin Telegram ID updated successfully.");
    } catch (error: any) {
      Alert.alert(
        "Save Error",
        error.message || "Unable to save admin Telegram ID."
      );
    } finally {
      setSaving(false);
    }
  }, [saving, settingsId, telegramId]);

  return {
    loading,
    saving,
    editing,
    telegramId,
    setTelegramId,
    startEditing,
    saveTelegramId,
    reloadSettings: loadSettings,
  };
}
