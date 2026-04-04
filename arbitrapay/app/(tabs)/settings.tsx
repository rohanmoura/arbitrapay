import { useSmsAdvancedSettings } from "@/hooks/useSmsAdvancedSettings";
import { useSmsForwardingSettings } from "@/hooks/useSmsForwardingSettings";
import { styles } from "@/screens/settings/Settings.styles";
import Constants from "expo-constants";
import { useMemo } from "react";
import {
    Alert,
    ActivityIndicator,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Settings() {
  const { loading, updating, state, setForwardingEnabled } = useSmsForwardingSettings();
  const {
    state: advancedState,
    loading: advancedLoading,
    saving: advancedSaving,
    openAutoStartHelp,
    openBatteryOptimizationHelp,
    markHideRecentAcknowledged,
    setKeepAliveEnabled,
    setSim1Label,
    setSim2Label,
    refreshQueueStatus,
  } = useSmsAdvancedSettings();
  const appVersion = useMemo(
    () => Constants.expoConfig?.version?.trim() || "1.0.0",
    []
  );

  const insets = useSafeAreaInsets();

  return (

    <SafeAreaView style={styles.safe}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >

        <View
          style={[
            styles.container,
            { paddingBottom: 80 + insets.bottom }
          ]}
        >

          <Text style={styles.title}>Settings</Text>


          {/* FORWARDING */}

          <View style={styles.card}>

            <Text style={styles.sectionTitle}>Forwarding Function</Text>

            <Text style={styles.sectionDesc}>
              Enable SMS forwarding when required.
            </Text>

            <View style={styles.row}>

              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Forward SMS</Text>
                <Text style={styles.rowDesc}>
                  Allow the app to read bank OTP and verification SMS messages.
                </Text>
              </View>

              {loading || updating ? (
                <ActivityIndicator size="small" color="#22C55E" />
              ) : (
                <Switch
                  value={state.enabled}
                  onValueChange={(value) => void setForwardingEnabled(value)}
                  trackColor={{ false: "#374151", true: "#22C55E" }}
                  thumbColor={state.enabled ? "#ffffff" : "#9CA3AF"}
                />
              )}

            </View>

            <Text style={styles.permissionStatus}>
              READ_SMS: {state.readSmsGranted ? "Granted" : "Not granted"} • RECEIVE_SMS:{" "}
              {state.receiveSmsGranted ? "Granted" : "Not granted"}
            </Text>

          </View>


          {/* KEEP ALIVE */}

          <View style={styles.card}>

            <Text style={styles.sectionTitle}>Keep Alive</Text>

            <Text style={styles.sectionDesc}>
              Recommended to keep these enabled so the app runs properly in background.
            </Text>

            <View style={styles.row}>

              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Auto Startup</Text>
                <Text style={styles.rowDesc}>
                  Launch the app automatically after device restart.
                </Text>
              </View>

              <Switch
                value={advancedState.autoStartupAcknowledged}
                onValueChange={() => void openAutoStartHelp()}
                trackColor={{ false: "#374151", true: "#22C55E" }}
                thumbColor={advancedState.autoStartupAcknowledged ? "#ffffff" : "#9CA3AF"}
              />

            </View>


            <View style={styles.row}>

              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Battery Optimization</Text>
                <Text style={styles.rowDesc}>
                  Disable battery restrictions for better performance.
                </Text>
              </View>

              <Switch
                value={advancedState.batteryOptimizationAcknowledged}
                onValueChange={() => void openBatteryOptimizationHelp()}
                trackColor={{ false: "#374151", true: "#22C55E" }}
                thumbColor={advancedState.batteryOptimizationAcknowledged ? "#ffffff" : "#9CA3AF"}
              />

            </View>


            <View style={styles.row}>

              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Hide From Recent Apps</Text>
                <Text style={styles.rowDesc}>
                  Hide the app from the recent apps screen.
                </Text>
              </View>

              <Switch
                value={advancedState.hideRecentAcknowledged}
                onValueChange={(value) => void markHideRecentAcknowledged(value)}
                trackColor={{ false: "#374151", true: "#22C55E" }}
                thumbColor={advancedState.hideRecentAcknowledged ? "#ffffff" : "#9CA3AF"}
              />

            </View>


            <View style={styles.row}>

              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Enable Keep Alive</Text>
                <Text style={styles.rowDesc}>
                  Keep background service running continuously.
                </Text>
              </View>

              {advancedLoading || advancedSaving ? (
                <ActivityIndicator size="small" color="#22C55E" />
              ) : (
                <Switch
                  value={advancedState.keepAliveEnabled}
                  onValueChange={(value) => void setKeepAliveEnabled(value)}
                  trackColor={{ false: "#374151", true: "#22C55E" }}
                  thumbColor={advancedState.keepAliveEnabled ? "#ffffff" : "#9CA3AF"}
                />
              )}

            </View>

            <Text style={styles.permissionStatus}>
              Pending OTP uploads: {advancedState.queuePendingCount}
            </Text>
            <Text style={styles.permissionStatus}>
              Retrying: {advancedState.queueRetryingCount} • Needs attention: {advancedState.queueFailedCount}
            </Text>

          </View>


          {/* SIM SETTINGS */}

          <View style={styles.card}>

            <Text style={styles.sectionTitle}>App Version</Text>
            <Text style={styles.sectionDesc}>
              This installed APK version is checked against backend support rules on app open.
            </Text>
            <Text style={styles.versionText}>Current Version: {appVersion}</Text>

          </View>

          <View style={styles.card}>

            <Text style={styles.sectionTitle}>SIM Settings</Text>

            <View style={styles.inputRow}>

              <TextInput
                value={advancedState.sim1Label}
                onChangeText={(value) => void setSim1Label(value)}
                placeholder="SIM 1 Label"
                placeholderTextColor="#6B7280"
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={() => {
                  void setSim1Label("Primary SIM");
                  Alert.alert("SIM Label Saved", "SIM 1 label has been updated.");
                }}
              >
                <Text style={styles.refreshText}>Refresh</Text>
              </TouchableOpacity>

            </View>


            <View style={styles.inputRow}>

              <TextInput
                value={advancedState.sim2Label}
                onChangeText={(value) => void setSim2Label(value)}
                placeholder="SIM 2 Label"
                placeholderTextColor="#6B7280"
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={() => {
                  void setSim2Label("Secondary SIM");
                  Alert.alert("SIM Label Saved", "SIM 2 label has been updated.");
                }}
              >
                <Text style={styles.refreshText}>Refresh</Text>
              </TouchableOpacity>

            </View>

            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={() => void refreshQueueStatus()}
            >
              <Text style={styles.refreshText}>Refresh Queue Status</Text>
            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>

  );
}
