import {
  type AdminAccountActivationRequest,
  type AdminAccountActivationsSummary,
  fetchAdminAccountActivations,
} from "@/services/adminAccountActivationsService";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

const EMPTY_SUMMARY: AdminAccountActivationsSummary = {
  total: 0,
  activated: 0,
  notActivated: 0,
};

export function useAdminAccountActivations() {
  const [requests, setRequests] = useState<AdminAccountActivationRequest[]>([]);
  const [summary, setSummary] = useState<AdminAccountActivationsSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    const data = await fetchAdminAccountActivations();
    setRequests(data.requests);
    setSummary(data.summary);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const run = async () => {
        try {
          setLoading(true);
          const data = await fetchAdminAccountActivations();

          if (!active) {
            return;
          }

          setRequests(data.requests);
          setSummary(data.summary);
        } catch (error: any) {
          if (active) {
            Alert.alert(
              "Account Activations Error",
              error.message || "Unable to load activation requests right now."
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      void run();

      return () => {
        active = false;
      };
    }, [])
  );

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      await loadRequests();
    } catch (error: any) {
      Alert.alert(
        "Account Activations Error",
        error.message || "Unable to refresh activation requests right now."
      );
    } finally {
      setLoading(false);
    }
  }, [loadRequests]);

  return {
    requests,
    summary,
    loading,
    refetch,
  };
}
