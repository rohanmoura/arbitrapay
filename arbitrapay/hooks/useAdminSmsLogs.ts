import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

import { fetchAdminSmsLogs, type AdminSmsLog } from "@/services/adminSmsLogsService";

export function useAdminSmsLogs() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [logs, setLogs] = useState<AdminSmsLog[]>([]);

  const loadLogs = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const nextLogs = await fetchAdminSmsLogs();
      setLogs(nextLogs);
    } catch (error: any) {
      Alert.alert(
        "SMS Logs Error",
        error.message || "Unable to load admin SMS logs right now."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadLogs();
    }, [loadLogs])
  );

  const filteredLogs = useMemo(() => {
    const query = searchInput.trim().toLowerCase();

    if (!query) {
      return logs;
    }

    return logs.filter((log) => {
      const haystacks = [
        log.sender,
        log.user.email || "",
        log.user.name || "",
        log.otpCode || "",
        log.bankName || "",
        log.device.deviceName || "",
        log.messageBody,
      ];

      return haystacks.some((value) => value.toLowerCase().includes(query));
    });
  }, [logs, searchInput]);

  return {
    loading,
    refreshing,
    searchInput,
    logs: filteredLogs,
    totalLogs: logs.length,
    setSearchInput,
    refreshLogs: () => loadLogs(true),
  };
}
