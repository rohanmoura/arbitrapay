import { useAdminSettings } from "@/hooks/useAdminSettings";
import { styles } from "@/screens/dashboard/AdminDashboard.styles";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AdminTelegramSettingsCard() {
  const {
    loading,
    saving,
    editing,
    telegramId,
    setTelegramId,
    startEditing,
    saveTelegramId,
  } = useAdminSettings();

  const editable = editing && !saving;

  return (
    <View style={styles.depositSetupCard}>
      <View style={styles.depositHeader}>
        <Text style={styles.depositTitle}>Admin Telegram ID</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={startEditing}
          disabled={loading || saving || editing}
        >
          <Ionicons name="create-outline" size={16} color="#A78BFA" />
          <Text style={styles.editText}>{editing ? "Editing" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.depositSubtitle}>
        This Telegram ID is shown across support surfaces in the app.
      </Text>

      {loading ? (
        <View style={styles.depositLoadingBox}>
          <ActivityIndicator size="small" color="#A78BFA" />
          <Text style={styles.depositLoadingText}>Loading Telegram settings...</Text>
        </View>
      ) : (
        <View style={styles.depositInfoCard}>
          <Text style={styles.depositLabel}>Telegram ID</Text>
          <TextInput
            value={telegramId}
            onChangeText={setTelegramId}
            editable={editable}
            placeholder="Enter Telegram ID"
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            style={[styles.depositInput, !editable && styles.depositInputReadonly]}
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.saveBtn, (!editing || loading || saving) && styles.saveBtnDisabled]}
        onPress={saveTelegramId}
        disabled={!editing || loading || saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
