import { useAppVersionGate } from "@/hooks/useAppVersionGate";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AppVersionGate() {
  const {
    loading,
    initialCheckComplete,
    error,
    policy,
    currentVersion,
    isSupported,
    isHardBlocked,
    refreshVersionPolicy,
  } = useAppVersionGate();
  const [openingUpdateUrl, setOpeningUpdateUrl] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
  }, [policy?.id, isSupported]);

  const primaryActionLabel = policy?.updateUrl?.includes("t.me")
    ? "Contact Admin"
    : "Install Latest Version";

  const handleOpenUpdate = useCallback(async () => {
    if (!policy?.updateUrl || openingUpdateUrl) {
      return;
    }

    try {
      setOpeningUpdateUrl(true);
      const supported = await Linking.canOpenURL(policy.updateUrl);

      if (supported) {
        await Linking.openURL(policy.updateUrl);
      }
    } finally {
      setOpeningUpdateUrl(false);
    }
  }, [openingUpdateUrl, policy?.updateUrl]);

  if (!initialCheckComplete) {
    return (
      <Modal visible transparent={false} animationType="fade">
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <ActivityIndicator size="small" color="#FACC15" />
            </View>

            <Text style={styles.title}>Checking App Version</Text>
            <Text style={styles.message}>
              Please wait while we verify whether this APK is still supported.
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (loading || isSupported || dismissed) {
    return null;
  }

  return (
    <Modal visible transparent={false} animationType="fade">
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="alert-circle-outline" size={28} color="#FACC15" />
          </View>

          <Text style={styles.title}>{policy?.title || "Update Required"}</Text>
          <Text style={styles.message}>
            {policy?.message ||
              "This version is no longer supported. Please install the latest version."}
          </Text>

          <View style={styles.metaCard}>
            <Text style={styles.metaText}>Current version: {currentVersion}</Text>
            <Text style={styles.metaText}>
              Minimum supported: {policy?.minimumSupportedVersion || "Not available"}
            </Text>
            <Text style={styles.metaText}>
              Latest version: {policy?.latestVersion || "Not available"}
            </Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {policy?.updateUrl ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleOpenUpdate}
              disabled={openingUpdateUrl}
            >
              {openingUpdateUrl ? (
                <ActivityIndicator size="small" color="#F8FAFC" />
              ) : (
                <Text style={styles.primaryButtonText}>{primaryActionLabel}</Text>
              )}
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              if (isHardBlocked) {
                void refreshVersionPolicy();
                return;
              }

              setDismissed(true);
            }}
          >
            <Text style={styles.secondaryButtonText}>
              {isHardBlocked ? "Recheck Version" : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070B16",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  card: {
    width: "100%",
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(250,204,21,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  title: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "700",
  },

  message: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },

  metaCard: {
    backgroundColor: "#0B1220",
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    gap: 8,
  },

  metaText: {
    color: "#94A3B8",
    fontSize: 13,
  },

  errorText: {
    color: "#FCA5A5",
    fontSize: 12,
    marginTop: 14,
  },

  primaryButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  primaryButtonText: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#1F2937",
  },

  secondaryButtonText: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "600",
  },
});
