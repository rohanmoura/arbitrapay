import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid, Platform } from "react-native";

import {
  getSmsReceiverStatus,
  setSmsReceiverEnabled,
} from "@/services/smsReceiverService";

const SMS_PERMISSION_PROMPTED_KEY = "sms_permission_prompted_v1";

export async function requestSmsPermissions() {
  if (Platform.OS !== "android") {
    return {
      granted: false,
      readSmsGranted: false,
      receiveSmsGranted: false,
    };
  }

  const results = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.READ_SMS,
    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  ]);

  const readSmsGranted =
    results[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
    PermissionsAndroid.RESULTS.GRANTED;
  const receiveSmsGranted =
    results[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] ===
    PermissionsAndroid.RESULTS.GRANTED;

  if (readSmsGranted && receiveSmsGranted) {
    await setSmsReceiverEnabled(true);
  }

  return {
    granted: readSmsGranted && receiveSmsGranted,
    readSmsGranted,
    receiveSmsGranted,
  };
}

export async function ensureSmsPermissionsRequestedOnStartup() {
  if (Platform.OS !== "android") {
    return null;
  }

  const hasPrompted = await AsyncStorage.getItem(SMS_PERMISSION_PROMPTED_KEY);
  const status = await getSmsReceiverStatus();

  if (status.readSmsGranted && status.receiveSmsGranted) {
    return status;
  }

  if (hasPrompted) {
    return status;
  }

  await AsyncStorage.setItem(SMS_PERMISSION_PROMPTED_KEY, "1");
  await requestSmsPermissions();

  return getSmsReceiverStatus();
}
