import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  deleteAdminUpdate,
  fetchAdminUpdates,
  toggleAdminUpdateStatus,
  type AdminUpdateRecord,
} from "@/services/adminUpdatesService";

export type AdminUpdatesTab = "active" | "inactive";

export function useAdminUpdates() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AdminUpdateRecord[]>([]);
  const [activeTab, setActiveTab] = useState<AdminUpdatesTab>("active");
  const [actionUpdateId, setActionUpdateId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"delete" | "toggle" | null>(null);

  const loadUpdates = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAdminUpdates();
      setItems(data);
    } catch (error: any) {
      Alert.alert(
        "Updates Error",
        error.message || "Unable to load updates right now."
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadUpdates();
    }, [loadUpdates])
  );

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        activeTab === "active" ? item.is_active : !item.is_active
      ),
    [activeTab, items]
  );

  const toggleStatus = useCallback(async (item: AdminUpdateRecord) => {
    if (actionUpdateId) {
      return;
    }

    setActionUpdateId(item.id);
    setActionType("toggle");

    try {
      const updated = await toggleAdminUpdateStatus(item.id, !item.is_active);
      setItems((current) =>
        current.map((entry) => (entry.id === updated.id ? updated : entry))
      );
    } catch (error: any) {
      Alert.alert(
        "Update Error",
        error.message || "Unable to update this status."
      );
    } finally {
      setActionUpdateId(null);
      setActionType(null);
    }
  }, [actionUpdateId]);

  const removeUpdate = useCallback(async (updateId: string) => {
    if (actionUpdateId) {
      return;
    }

    setActionUpdateId(updateId);
    setActionType("delete");

    try {
      await deleteAdminUpdate(updateId);
      setItems((current) => current.filter((item) => item.id !== updateId));
    } catch (error: any) {
      Alert.alert(
        "Delete Error",
        error.message || "Unable to delete this update."
      );
    } finally {
      setActionUpdateId(null);
      setActionType(null);
    }
  }, [actionUpdateId]);

  return {
    loading,
    totalCount: items.length,
    activeTab,
    setActiveTab,
    items: filteredItems,
    actionUpdateId,
    actionType,
    refreshUpdates: loadUpdates,
    toggleStatus,
    removeUpdate,
  };
}
