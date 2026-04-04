import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import {
  ensureSmsPermissionsRequestedOnStartup,
  requestSmsPermissions,
} from "@/services/smsPermissionService";
import {
  getSmsReceiverStatus,
  setSmsReceiverEnabled,
} from "@/services/smsReceiverService";

type SmsPermissionState = {
  enabled: boolean;
  readSmsGranted: boolean;
  receiveSmsGranted: boolean;
};

const EMPTY_STATE: SmsPermissionState = {
  enabled: false,
  readSmsGranted: false,
  receiveSmsGranted: false,
};

export function useSmsForwardingSettings() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [state, setState] = useState<SmsPermissionState>(EMPTY_STATE);

  const loadState = useCallback(async () => {
    const status = await getSmsReceiverStatus();
    setState(status);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const run = async () => {
        try {
          setLoading(true);
          await ensureSmsPermissionsRequestedOnStartup();
          const status = await getSmsReceiverStatus();

          if (active) {
            setState(status);
          }
        } catch (error: any) {
          if (active) {
            Alert.alert(
              "SMS Settings Error",
              error.message || "Unable to load SMS forwarding settings."
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

  const setForwardingEnabled = useCallback(
    async (enabled: boolean) => {
      try {
        setUpdating(true);

        if (enabled) {
          const permissionResult = await requestSmsPermissions();

          if (!permissionResult.granted) {
            const refreshed = await getSmsReceiverStatus();
            setState(refreshed);
            Alert.alert(
              "Permission Needed",
              "SMS permissions are required to enable OTP forwarding."
            );
            return;
          }
        } else {
          await setSmsReceiverEnabled(false);
        }

        await loadState();
      } catch (error: any) {
        Alert.alert(
          "SMS Settings Error",
          error.message || "Unable to update SMS forwarding."
        );
      } finally {
        setUpdating(false);
      }
    },
    [loadState]
  );

  return {
    loading,
    updating,
    state,
    setForwardingEnabled,
    refreshSmsSettings: loadState,
  };
}
