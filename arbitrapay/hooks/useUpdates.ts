import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { fetchActiveUpdates, UpdateRecord } from "@/services/updateService";

export function useUpdates() {
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<UpdateRecord[]>([]);

  const loadUpdates = useCallback(async () => {
    setLoading(true);

    try {
      const nextUpdates = await fetchActiveUpdates();
      setUpdates(nextUpdates);
    } catch (error: any) {
      Alert.alert(
        "Updates Error",
        error.message || "Unable to load updates right now."
      );
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUpdates();
    }, [loadUpdates])
  );

  return {
    loading,
    updates,
    refreshUpdates: loadUpdates,
  };
}
