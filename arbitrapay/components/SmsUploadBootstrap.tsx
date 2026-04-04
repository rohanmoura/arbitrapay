import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  getAppChannel,
  getAppPlatform,
  getCurrentAppVersion,
} from "@/lib/appIdentity";
import {
  clearSmsUploadConfig,
  configureSmsUpload,
  configureSmsForwardingRules,
  flushSmsUploadQueue,
} from "@/services/smsReceiverService";
import {
  syncSmsDeviceMonitoring,
  upsertSmsDeviceForCurrentUser,
} from "@/services/smsDeviceService";
import { fetchActiveSmsForwardingRules } from "@/services/smsRulesService";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export default function SmsUploadBootstrap() {
  const { session } = useAuth();

  useEffect(() => {
    let active = true;
    let monitoringInterval: ReturnType<typeof setInterval> | null = null;

    const syncUploadConfig = async () => {
      if (!session?.user?.id || !session.access_token) {
        await clearSmsUploadConfig();
        if (monitoringInterval) {
          clearInterval(monitoringInterval);
        }
        return;
      }

      try {
        const device = await upsertSmsDeviceForCurrentUser(session.user.id);

        if (!active) {
          return;
        }

        await configureSmsUpload({
          endpointUrl: `${supabaseUrl}/rest/v1/sms_logs`,
          anonKey: supabaseAnonKey,
          accessToken: session.access_token,
          userId: session.user.id,
          deviceId: device.id,
          appVersion: getCurrentAppVersion(),
          platform: getAppPlatform(),
          channel: getAppChannel(),
        });

        const rules = await fetchActiveSmsForwardingRules();
        await configureSmsForwardingRules(rules);

        await flushSmsUploadQueue();
        await syncSmsDeviceMonitoring({
          userId: session.user.id,
          deviceId: device.id,
          markRuleSync: true,
        });

        if (monitoringInterval) {
          clearInterval(monitoringInterval);
        }

        monitoringInterval = setInterval(() => {
          void syncSmsDeviceMonitoring({
            userId: session.user.id,
            deviceId: device.id,
          }).catch((error: any) => {
            console.warn(
              "Unable to sync SMS device monitoring.",
              error?.message || error
            );
          });
        }, 30000);
      } catch (error: any) {
        console.warn(
          "Unable to configure SMS upload pipeline.",
          error?.message || error
        );
      }
    };

    void syncUploadConfig();

    return () => {
      active = false;
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
      }
    };
  }, [session]);

  return null;
}
