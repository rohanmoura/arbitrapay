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
  flushSmsUploadQueue,
} from "@/services/smsReceiverService";
import { upsertSmsDeviceForCurrentUser } from "@/services/smsDeviceService";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export default function SmsUploadBootstrap() {
  const { session } = useAuth();

  useEffect(() => {
    let active = true;

    const syncUploadConfig = async () => {
      if (!session?.user?.id || !session.access_token) {
        await clearSmsUploadConfig();
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

        await flushSmsUploadQueue();
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
    };
  }, [session]);

  return null;
}
