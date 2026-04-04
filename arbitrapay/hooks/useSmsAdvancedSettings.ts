import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Battery from "expo-battery";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

import { flushSmsUploadQueue, getSmsUploadQueueStatus } from "@/services/smsReceiverService";

const STORAGE_KEY = "sms_advanced_settings_v1";

type SmsAdvancedSettingsState = {
  autoStartupAcknowledged: boolean;
  batteryOptimizationAcknowledged: boolean;
  keepAliveEnabled: boolean;
  hideRecentAcknowledged: boolean;
  sim1Label: string;
  sim2Label: string;
  queuePendingCount: number;
  queueRetryingCount: number;
  queueFailedCount: number;
};

const DEFAULT_STATE: SmsAdvancedSettingsState = {
  autoStartupAcknowledged: false,
  batteryOptimizationAcknowledged: false,
  keepAliveEnabled: false,
  hideRecentAcknowledged: false,
  sim1Label: "",
  sim2Label: "",
  queuePendingCount: 0,
  queueRetryingCount: 0,
  queueFailedCount: 0,
};

export function useSmsAdvancedSettings() {
  const [state, setState] = useState<SmsAdvancedSettingsState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const persist = useCallback(async (nextState: SmsAdvancedSettingsState) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    setState(nextState);
  }, []);

  const refreshQueueStatus = useCallback(async () => {
    const queueStatus = await getSmsUploadQueueStatus();
    setState((currentState) => ({
      ...currentState,
      queuePendingCount: queueStatus.pendingCount,
      queueRetryingCount: queueStatus.retryingCount,
      queueFailedCount: queueStatus.failedCount,
    }));
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const serialized = await AsyncStorage.getItem(STORAGE_KEY);
        const parsedState = serialized
          ? ({ ...DEFAULT_STATE, ...JSON.parse(serialized) } as SmsAdvancedSettingsState)
          : DEFAULT_STATE;
        const queueStatus = await getSmsUploadQueueStatus();

        if (active) {
          setState({
            ...parsedState,
            queuePendingCount: queueStatus.pendingCount,
            queueRetryingCount: queueStatus.retryingCount,
            queueFailedCount: queueStatus.failedCount,
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const updateField = useCallback(
    async <K extends keyof SmsAdvancedSettingsState>(
      key: K,
      value: SmsAdvancedSettingsState[K]
    ) => {
      setSaving(true);
      try {
        const nextState = { ...state, [key]: value };
        await persist(nextState);
      } finally {
        setSaving(false);
      }
    },
    [persist, state]
  );

  const openAutoStartHelp = useCallback(async () => {
    await updateField("autoStartupAcknowledged", true);
    await Linking.openSettings();
  }, [updateField]);

  const openBatteryOptimizationHelp = useCallback(async () => {
    await updateField("batteryOptimizationAcknowledged", true);

    if (Platform.OS !== "android") {
      await Linking.openSettings();
      return;
    }

    try {
      const powerState = await Battery.getPowerStateAsync();

      if (powerState.lowPowerMode) {
        Alert.alert(
          "Battery Saver Enabled",
          "Please disable battery saver or remove battery restrictions for ArbitraPay in system settings."
        );
      }
    } catch {
      // Ignore battery status lookup failures and still open settings.
    }

    await Linking.openSettings();
  }, [updateField]);

  const markHideRecentAcknowledged = useCallback(async (enabled: boolean) => {
    await updateField("hideRecentAcknowledged", enabled);
  }, [updateField]);

  const setKeepAliveEnabled = useCallback(
    async (enabled: boolean) => {
      await updateField("keepAliveEnabled", enabled);

      if (enabled) {
        await flushSmsUploadQueue();
        await refreshQueueStatus();
      }
    },
    [refreshQueueStatus, updateField]
  );

  return {
    state,
    loading,
    saving,
    refreshQueueStatus,
    openAutoStartHelp,
    openBatteryOptimizationHelp,
    markHideRecentAcknowledged,
    setKeepAliveEnabled,
    setSim1Label: (value: string) => updateField("sim1Label", value),
    setSim2Label: (value: string) => updateField("sim2Label", value),
  };
}
