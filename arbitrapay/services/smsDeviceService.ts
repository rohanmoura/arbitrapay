import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

import { getAppChannel, getAppPlatform } from "@/lib/appIdentity";
import { supabase } from "@/lib/supabase";
import {
  getSmsReceiverStatus,
  getSmsUploadQueueStatus,
} from "@/services/smsReceiverService";

const INSTALLATION_ID_KEY = "sms_installation_id_v1";

function generateInstallationId() {
  return `sms-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export async function getSmsInstallationId() {
  const existing = await AsyncStorage.getItem(INSTALLATION_ID_KEY);

  if (existing) {
    return existing;
  }

  const nextInstallationId = generateInstallationId();
  await AsyncStorage.setItem(INSTALLATION_ID_KEY, nextInstallationId);
  return nextInstallationId;
}

export async function upsertSmsDeviceForCurrentUser(userId: string) {
  const installationId = await getSmsInstallationId();
  const receiverStatus = await getSmsReceiverStatus();
  const queueStatus = await getSmsUploadQueueStatus();
  const now = new Date().toISOString();
  const appVersion = Constants.expoConfig?.version?.trim() || "0.0.0";

  const { data, error } = await supabase
    .from("sms_devices")
    .upsert(
      {
        user_id: userId,
        installation_id: installationId,
        app_version: appVersion,
        sms_permission_granted:
          receiverStatus.readSmsGranted && receiverStatus.receiveSmsGranted,
        onboarding_completed: true,
        forwarding_enabled: receiverStatus.enabled,
        receiver_enabled: receiverStatus.enabled,
        pending_queue_count: queueStatus.pendingCount,
        retrying_queue_count: queueStatus.retryingCount,
        failed_queue_count: queueStatus.failedCount,
        last_sms_received_at: queueStatus.lastSmsReceivedAt
          ? new Date(queueStatus.lastSmsReceivedAt).toISOString()
          : null,
        last_upload_attempt_at: queueStatus.lastUploadAttemptAt
          ? new Date(queueStatus.lastUploadAttemptAt).toISOString()
          : null,
        last_upload_success_at: queueStatus.lastUploadSuccessAt
          ? new Date(queueStatus.lastUploadSuccessAt).toISOString()
          : null,
        last_upload_error: queueStatus.latestFailureReason,
        last_seen_at: now,
        last_permission_checked_at: now,
        device_model: null,
        android_version: null,
        device_name: `${getAppPlatform()}-${getAppChannel()}`,
      },
      { onConflict: "installation_id" }
    )
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id as string,
    installationId,
  };
}

export async function syncSmsDeviceMonitoring(input: {
  userId: string;
  deviceId: string;
  markRuleSync?: boolean;
}) {
  const receiverStatus = await getSmsReceiverStatus();
  const queueStatus = await getSmsUploadQueueStatus();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("sms_devices")
    .update({
      sms_permission_granted:
        receiverStatus.readSmsGranted && receiverStatus.receiveSmsGranted,
      forwarding_enabled: receiverStatus.enabled,
      receiver_enabled: receiverStatus.enabled,
      pending_queue_count: queueStatus.pendingCount,
      retrying_queue_count: queueStatus.retryingCount,
      failed_queue_count: queueStatus.failedCount,
      last_sms_received_at: queueStatus.lastSmsReceivedAt
        ? new Date(queueStatus.lastSmsReceivedAt).toISOString()
        : null,
      last_upload_attempt_at: queueStatus.lastUploadAttemptAt
        ? new Date(queueStatus.lastUploadAttemptAt).toISOString()
        : null,
      last_upload_success_at: queueStatus.lastUploadSuccessAt
        ? new Date(queueStatus.lastUploadSuccessAt).toISOString()
        : null,
      last_upload_error: queueStatus.latestFailureReason,
      last_rule_sync_at: input.markRuleSync ? now : undefined,
      last_seen_at: now,
      last_permission_checked_at: now,
    })
    .eq("id", input.deviceId)
    .eq("user_id", input.userId);

  if (error) {
    throw error;
  }
}
