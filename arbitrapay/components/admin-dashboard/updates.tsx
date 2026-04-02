import FullScreenLoader from "@/components/FullScreenLoader";
import { useAdminUpdates } from "@/hooks/useAdminUpdates";
import { styles } from "@/screens/admin-dashboard/AdminUpdates.styles";
import type { AdminUpdateRecord } from "@/services/adminUpdatesService";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function formatCreatedAt(value?: string | null) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function truncateMessage(message: string, limit = 120) {
  if (message.length <= limit) {
    return message;
  }

  return `${message.slice(0, limit).trimEnd()}...`;
}

export default function AdminUpdatesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    loading,
    totalCount,
    activeTab,
    setActiveTab,
    items,
    actionUpdateId,
    actionType,
    toggleStatus,
    removeUpdate,
  } = useAdminUpdates();

  const openDetail = useCallback((item?: AdminUpdateRecord, mode: "view" | "edit" | "create" = "view") => {
    const path = item
      ? `/admin-update-detail?id=${item.id}&mode=${mode}`
      : `/admin-update-detail?mode=${mode}`;

    router.push(path as Href);
  }, [router]);

  const confirmDelete = useCallback((item: AdminUpdateRecord) => {
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
          onPress: () => {
            void removeUpdate(item.id);
          },
        },
      ]
    );
  }, [removeUpdate]);

  const renderItem = useCallback(({ item }: { item: AdminUpdateRecord }) => {
    const isBusy = actionUpdateId === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{item.title}</Text>

          <View
            style={[
              styles.statusBadge,
              item.is_active ? styles.statusBadgeActive : styles.statusBadgeInactive,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.is_active ? styles.statusTextActive : styles.statusTextInactive,
              ]}
            >
              {item.is_active ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>

        <Text style={styles.message}>{truncateMessage(item.message)}</Text>
        <Text style={styles.date}>{formatCreatedAt(item.created_at)}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.viewBtn]}
            onPress={() => openDetail(item, "view")}
          >
            <View style={styles.buttonInner}>
              <Ionicons name="eye-outline" size={14} color="#A5B4FC" />
              <Text style={styles.viewText}>View</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.editBtn]}
            onPress={() => openDetail(item, "edit")}
          >
            <View style={styles.buttonInner}>
              <Ionicons name="create-outline" size={14} color="#93C5FD" />
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.toggleBtn,
              isBusy && actionType === "toggle" && styles.disabledBtn,
            ]}
            disabled={isBusy}
            onPress={() => void toggleStatus(item)}
          >
            <View style={styles.buttonInner}>
              {isBusy && actionType === "toggle" ? (
                <ActivityIndicator size="small" color="#E2E8F0" />
              ) : (
                <Ionicons
                  name={item.is_active ? "toggle" : "toggle-outline"}
                  size={14}
                  color="#E2E8F0"
                />
              )}
              <Text style={styles.toggleText}>
                {item.is_active ? "Set Inactive" : "Set Active"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.deleteBtn,
              isBusy && actionType === "delete" && styles.disabledBtn,
            ]}
            disabled={isBusy}
            onPress={() => confirmDelete(item)}
          >
            <View style={styles.buttonInner}>
              {isBusy && actionType === "delete" ? (
                <ActivityIndicator size="small" color="#FCA5A5" />
              ) : (
                <Ionicons name="trash-outline" size={14} color="#FCA5A5" />
              )}
              <Text style={styles.deleteText}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [actionType, actionUpdateId, confirmDelete, openDetail, toggleStatus]);

  const emptyComponent = useMemo(() => (
    <View style={styles.emptyState}>
      <Ionicons name="megaphone-outline" size={42} color="#64748B" />
      <Text style={styles.emptyTitle}>No updates found</Text>
      <Text style={styles.emptyText}>
        Create a new update or switch tabs to see other announcements.
      </Text>
    </View>
  ), []);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          Updates <Text style={styles.count}>({totalCount})</Text>
        </Text>

        <TouchableOpacity
          style={styles.newButton}
          onPress={() => openDetail(undefined, "create")}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.newButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {(["active", "inactive"] as const).map((tab) => {
          const selected = activeTab === tab;

          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, selected && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, selected && styles.tabTextActive]}>
                {tab === "active" ? "Active" : "Inactive"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={emptyComponent}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 90 },
        ]}
      />
    </View>
  );
}
