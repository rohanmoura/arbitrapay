import { useCallback, useEffect, useMemo, useState } from "react";
import { AppState, type AppStateStatus, Platform } from "react-native";

import { getCurrentAppVersion } from "@/lib/appIdentity";
import {
  cacheActiveAppVersionPolicy,
  clearCachedAppVersionPolicy,
  evaluateAppVersionPolicy,
  fetchActiveAppVersionPolicy,
  getCachedAppVersionPolicy,
  type AppVersionPolicy,
} from "@/services/appVersionService";

export function useAppVersionGate() {
  const [loading, setLoading] = useState(true);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  const [policy, setPolicy] = useState<AppVersionPolicy | null>(null);
  const [error, setError] = useState("");
  const currentVersion = getCurrentAppVersion();
  const platform =
    Platform.OS === "ios" ? "ios" : Platform.OS === "android" ? "android" : "web";

  const loadPolicy = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const cachedPolicy = await getCachedAppVersionPolicy(platform);

      if (cachedPolicy) {
        setPolicy(cachedPolicy);
      }

      const nextPolicy = await fetchActiveAppVersionPolicy(platform);
      setPolicy(nextPolicy);

      if (nextPolicy) {
        await cacheActiveAppVersionPolicy(nextPolicy);
      } else {
        await clearCachedAppVersionPolicy(platform);
      }
    } catch (loadError: any) {
      setError(loadError?.message || "Unable to verify app version.");
      const cachedPolicy = await getCachedAppVersionPolicy(platform);
      setPolicy(cachedPolicy);
    } finally {
      setLoading(false);
      setInitialCheckComplete(true);
    }
  }, [platform]);

  useEffect(() => {
    void loadPolicy();
  }, [loadPolicy]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (status: AppStateStatus) => {
        if (status === "active") {
          void loadPolicy();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [loadPolicy]);

  const evaluation = useMemo(
    () => evaluateAppVersionPolicy(currentVersion, policy),
    [currentVersion, policy]
  );

  return {
    loading,
    initialCheckComplete,
    error,
    currentVersion,
    policy,
    ...evaluation,
    refreshVersionPolicy: loadPolicy,
  };
}
