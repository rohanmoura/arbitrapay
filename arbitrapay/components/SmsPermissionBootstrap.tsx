import { useEffect } from "react";

import { ensureSmsPermissionsRequestedOnStartup } from "@/services/smsPermissionService";

export default function SmsPermissionBootstrap() {
  useEffect(() => {
    void ensureSmsPermissionsRequestedOnStartup().catch((error: any) => {
      console.warn(
        "Unable to complete startup SMS permission request.",
        error?.message || error
      );
    });
  }, []);

  return null;
}
