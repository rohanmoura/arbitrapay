import Constants from "expo-constants";
import { Platform } from "react-native";

export type AppPlatform = "android" | "ios" | "web";

export function getAppPlatform(): AppPlatform {
  if (Platform.OS === "ios") {
    return "ios";
  }

  if (Platform.OS === "android") {
    return "android";
  }

  return "web";
}

export function getAppChannel() {
  return "production";
}

export function getCurrentAppVersion() {
  return Constants.expoConfig?.version?.trim() || "0.0.0";
}

export function getSupabaseAppHeaders() {
  return {
    "x-app-version": getCurrentAppVersion(),
    "x-app-platform": getAppPlatform(),
    "x-app-channel": getAppChannel(),
  };
}
