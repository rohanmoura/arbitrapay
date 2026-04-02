import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "@/contexts/AuthContext";
import {
  createAdminUpdate,
  deleteAdminUpdate,
  fetchAdminUpdateById,
  toggleAdminUpdateStatus,
  updateAdminUpdate,
  type AdminUpdateRecord,
} from "@/services/adminUpdatesService";

export type AdminUpdateDetailMode = "view" | "edit" | "create";

export function useAdminUpdateDetail(updateId?: string, initialMode: AdminUpdateDetailMode = "view") {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(initialMode !== "create");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mode, setMode] = useState<AdminUpdateDetailMode>(initialMode);
  const [record, setRecord] = useState<AdminUpdateRecord | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);

  const hydrate = useCallback((item: AdminUpdateRecord | null) => {
    setRecord(item);
    setTitle(item?.title || "");
    setMessage(item?.message || "");
    setIsActive(item?.is_active ?? true);
  }, []);

  const loadUpdate = useCallback(async () => {
    if (!updateId) {
      hydrate(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchAdminUpdateById(updateId);
      hydrate(data);
    } catch (error: any) {
      Alert.alert(
        "Update Error",
        error.message || "Unable to load this update."
      );
      hydrate(null);
    } finally {
      setLoading(false);
    }
  }, [hydrate, updateId]);

  useFocusEffect(
    useCallback(() => {
      void loadUpdate();
    }, [loadUpdate])
  );

  const canSave = useMemo(
    () => Boolean(title.trim() && message.trim()) && !saving && !deleting,
    [deleting, message, saving, title]
  );

  const saveUpdate = useCallback(async () => {
    if (!canSave) {
      if (!title.trim() || !message.trim()) {
        Alert.alert("Validation Error", "Title and message are required.");
      }
      return null;
    }

    setSaving(true);

    try {
      const saved = updateId
        ? await updateAdminUpdate({
            id: updateId,
            title,
            message,
            isActive,
          })
        : await createAdminUpdate({
            title,
            message,
            isActive,
            createdBy: profile?.id,
          });

      hydrate(saved);
      setMode("view");
      Alert.alert("Saved", updateId ? "Update saved successfully." : "Update created successfully.");
      return saved;
    } catch (error: any) {
      Alert.alert(
        "Save Error",
        error.message || "Unable to save this update."
      );
      return null;
    } finally {
      setSaving(false);
    }
  }, [canSave, hydrate, isActive, message, profile?.id, title, updateId]);

  const deleteUpdate = useCallback(async () => {
    if (!updateId || deleting) {
      return false;
    }

    setDeleting(true);

    try {
      await deleteAdminUpdate(updateId);
      return true;
    } catch (error: any) {
      Alert.alert(
        "Delete Error",
        error.message || "Unable to delete this update."
      );
      return false;
    } finally {
      setDeleting(false);
    }
  }, [deleting, updateId]);

  const toggleStatus = useCallback(async () => {
    if (!updateId || saving || deleting) {
      setIsActive((current) => !current);
      return null;
    }

    try {
      const updated = await toggleAdminUpdateStatus(updateId, !isActive);
      hydrate(updated);
      return updated;
    } catch (error: any) {
      Alert.alert(
        "Update Error",
        error.message || "Unable to update this status."
      );
      return null;
    }
  }, [deleting, hydrate, isActive, saving, updateId]);

  return {
    loading,
    saving,
    deleting,
    mode,
    setMode,
    record,
    title,
    setTitle,
    message,
    setMessage,
    isActive,
    setIsActive,
    canSave,
    saveUpdate,
    deleteUpdate,
    toggleStatus,
  };
}
