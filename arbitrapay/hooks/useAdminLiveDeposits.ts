import {
  fetchAdminLiveDeposits,
  type AdminLiveDepositRecord,
} from "@/services/adminLiveDepositsService";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export function useAdminLiveDeposits() {
  const [requests, setRequests] = useState<AdminLiveDepositRecord[]>([]);
  const [totalActivatedAccounts, setTotalActivatedAccounts] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    const data = await fetchAdminLiveDeposits();
    setRequests(data.requests);
    setTotalActivatedAccounts(data.totalActivatedAccounts);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const run = async () => {
        try {
          setLoading(true);
          const data = await fetchAdminLiveDeposits();

          if (!active) {
            return;
          }

          setRequests(data.requests);
          setTotalActivatedAccounts(data.totalActivatedAccounts);
        } catch (error: any) {
          if (active) {
            Alert.alert(
              "Live Deposits Error",
              error.message || "Unable to load activated accounts right now."
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
        "Live Deposits Error",
        error.message || "Unable to refresh activated accounts right now."
      );
    } finally {
      setLoading(false);
    }
  }, [loadRequests]);

  return {
    requests,
    totalActivatedAccounts,
    loading,
    refetch,
  };
}
