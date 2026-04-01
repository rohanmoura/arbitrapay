import {
  fetchAdminLiveDepositHistory,
  type AdminLiveDepositHistoryRecord,
  type AdminLiveDepositHistorySummary,
} from "@/services/adminLiveDepositHistoryService";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

const EMPTY_SUMMARY: AdminLiveDepositHistorySummary = {
  totalUsersWithDeposits: 0,
  totalActivatedAccounts: 0,
};

export function useAdminLiveDepositHistory() {
  const [records, setRecords] = useState<AdminLiveDepositHistoryRecord[]>([]);
  const [summary, setSummary] = useState<AdminLiveDepositHistorySummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    const data = await fetchAdminLiveDepositHistory();
    setRecords(data.records);
    setSummary(data.summary);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const run = async () => {
        try {
          setLoading(true);
          const data = await fetchAdminLiveDepositHistory();

          if (!active) {
            return;
          }

          setRecords(data.records);
          setSummary(data.summary);
        } catch (error: any) {
          if (active) {
            Alert.alert(
              "Live Deposit History Error",
              error.message || "Unable to load live deposit history right now."
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
      await loadHistory();
    } catch (error: any) {
      Alert.alert(
        "Live Deposit History Error",
        error.message || "Unable to refresh live deposit history right now."
      );
    } finally {
      setLoading(false);
    }
  }, [loadHistory]);

  return {
    records,
    summary,
    loading,
    refetch,
  };
}
