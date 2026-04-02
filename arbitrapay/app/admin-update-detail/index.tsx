import FullScreenLoader from "@/components/FullScreenLoader";
import { useAdminUpdateDetail, type AdminUpdateDetailMode } from "@/hooks/useAdminUpdateDetail";
import { styles as updateStyles } from "@/screens/feature-compo/Updates.style";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatUpdateDate(date: string | null) {
  if (!date) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date(date))
    .replace(",", " •");
}

export default function AdminUpdateDetailScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    mode?: AdminUpdateDetailMode | AdminUpdateDetailMode[];
  }>();
  const updateId = useMemo(
    () => (Array.isArray(params.id) ? params.id[0] : params.id),
    [params.id]
  );
  const initialMode = useMemo<AdminUpdateDetailMode>(() => {
    const value = Array.isArray(params.mode) ? params.mode[0] : params.mode;

    if (value === "edit" || value === "create") {
      return value;
    }

    return "view";
  }, [params.mode]);
  const {
    loading,
    saving,
    deleting,
    mode,
    setMode,
    record,
    title,
    setTitle,
    message,
    setMessage,
    isActive,
    setIsActive,
    canSave,
    saveUpdate,
    deleteUpdate,
    toggleStatus,
  } = useAdminUpdateDetail(updateId, initialMode);

  const isEditing = mode !== "view";

  const handleSave = async () => {
    const saved = await saveUpdate();

    if (saved && !updateId) {
      router.replace(`/admin-update-detail?id=${saved.id}&mode=view`);
    }
  };

  const handleDelete = () => {
    if (!updateId) {
      router.back();
      return;
    }

    Alert.alert(
      "Delete Update",
      "Are you sure you want to delete this update?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const deleted = await deleteUpdate();

            if (deleted) {
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async () => {
    if (!updateId) {
      setIsActive((current) => !current);
      return;
    }

    await toggleStatus();
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <SafeAreaView style={updateStyles.safeArea}>
      <ScrollView
        contentContainerStyle={[updateStyles.container, styles.container]}
        showsVerticalScrollIndicator={false}
      >
        <View style={updateStyles.header}>
          <TouchableOpacity
            style={updateStyles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={updateStyles.headerTitle}>
            {mode === "create" ? "New Update" : "Update Detail"}
          </Text>
        </View>

        <Text style={updateStyles.subtitle}>
          {mode === "view"
            ? "Preview how this update appears to agents"
            : "Create and manage announcements shown on the user dashboard"}
        </Text>

        <View style={styles.topActionCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusLabel}>Visibility</Text>
              <Text style={styles.statusText}>{isActive ? "Active" : "Inactive"}</Text>
            </View>

            <Switch
              value={isActive}
              onValueChange={handleToggleStatus}
              trackColor={{ false: "#475569", true: "#8B5CF6" }}
              thumbColor="#F8FAFC"
            />
          </View>

          <View style={styles.actionRow}>
            {mode !== "create" ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => setMode(isEditing ? "view" : "edit")}
              >
                <Ionicons
                  name={isEditing ? "eye-outline" : "create-outline"}
                  size={16}
                  color="#CBD5F5"
                />
                <Text style={styles.secondaryButtonText}>
                  {isEditing ? "View Mode" : "Edit"}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#FCA5A5" />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={16} color="#FCA5A5" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter update title"
              placeholderTextColor="#64748B"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Message</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Write the full update message"
              placeholderTextColor="#64748B"
              style={styles.textArea}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.saveButton,
                !canSave && styles.disabledButton,
              ]}
              disabled={!canSave}
              onPress={handleSave}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save Update</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={updateStyles.updateCard}>
          <View style={updateStyles.updateAccent} />

          <View style={updateStyles.updateContentWrap}>
            <View style={updateStyles.updateHeader}>
              <View style={updateStyles.adminBadge}>
                <Ionicons name="megaphone-outline" size={14} color="#8B5CF6" />
                <Text style={updateStyles.adminText}>
                  {title.trim() || "Untitled Update"}
                </Text>
              </View>

              <View style={updateStyles.dateRow}>
                <Text style={updateStyles.updateDate}>
                  {formatUpdateDate(record?.created_at || null)}
                </Text>
              </View>
            </View>

            <Text style={updateStyles.updateContent}>
              {message.trim() || "No update message added yet."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  topActionCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 16,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    color: "#94A3B8",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  statusText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    flexWrap: "wrap",
  },
  actionButton: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  secondaryButton: {
    backgroundColor: "#1E1B4B",
    borderColor: "#3730A3",
  },
  secondaryButtonText: {
    color: "#CBD5F5",
    fontSize: 13,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#3F0D12",
    borderColor: "#7F1D1D",
  },
  deleteButtonText: {
    color: "#FCA5A5",
    fontSize: 13,
    fontWeight: "700",
  },
  formCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#020617",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
    color: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  textArea: {
    backgroundColor: "#020617",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
    color: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 150,
  },
  saveButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 18,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.55,
  },
});
