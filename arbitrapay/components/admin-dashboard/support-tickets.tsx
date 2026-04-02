import FullScreenLoader from "@/components/FullScreenLoader";
import { useAdminSupportTickets } from "@/hooks/useAdminSupportTickets";
import { styles } from "@/screens/admin-dashboard/SupportTickets.styles";
import { type AdminSupportTicket } from "@/services/adminSupportTicketsService";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function formatSupportDate(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  const datePart = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart} (${timePart})`;
}

function formatCategory(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const EmptyState = memo(function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No support tickets found.</Text>
    </View>
  );
});

const TicketCard = memo(function TicketCard({
  item,
  actionTicketId,
  actionType,
  onResolve,
  onDelete,
  onViewUser,
}: {
  item: AdminSupportTicket;
  actionTicketId: string | null;
  actionType: "resolve" | "delete" | null;
  onResolve: (ticketId: string) => void;
  onDelete: (ticketId: string) => void;
  onViewUser: (userId: string) => void;
}) {
  const displayName =
    !item.user.name?.trim() || item.user.name.trim() === "User"
      ? "User"
      : item.user.name.trim();
  const avatarCharacter = displayName.charAt(0).toUpperCase() || "U";
  const isUpdating = actionTicketId === item.id;

  const badgeStyle =
    item.status === "resolved"
      ? styles.resolvedBadge
      : item.status === "closed"
        ? styles.closedBadge
        : styles.pendingBadge;

  const statusLabel =
    item.status === "resolved"
      ? "Resolved"
      : item.status === "closed"
        ? "Closed"
        : "Pending";

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          {item.user.avatar ? (
            <Image source={{ uri: item.user.avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{avatarCharacter}</Text>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{item.user.email || "Not available"}</Text>
        </View>

        <View style={styles.statusWrap}>
          <View style={[styles.statusBadge, badgeStyle]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
          <Text style={styles.date}>{formatSupportDate(item.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View>
          <View style={styles.labelRow}>
            <Ionicons name="pricetag-outline" size={14} color="#94A3B8" />
            <Text style={styles.label}>Category</Text>
          </View>
          <Text style={styles.value}>{formatCategory(item.category)}</Text>
        </View>

        <View>
          <View style={styles.labelRow}>
            <Ionicons name="document-text-outline" size={14} color="#94A3B8" />
            <Text style={styles.label}>Subject</Text>
          </View>
          <Text style={styles.value}>{item.subject || "Not available"}</Text>
        </View>

        <View>
          <View style={styles.labelRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={14} color="#94A3B8" />
            <Text style={styles.label}>Message</Text>
          </View>
          <Text style={styles.message}>{item.message || "Not available"}</Text>
        </View>

        <View>
          <View style={styles.labelRow}>
            <Ionicons name="paper-plane-outline" size={14} color="#94A3B8" />
            <Text style={styles.label}>Telegram</Text>
          </View>
          <Text style={styles.value}>{item.userTelegramId?.trim() || "Not given"}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {item.status === "pending" && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.approveBtn,
              isUpdating && actionType === "resolve" && styles.disabledBtn,
            ]}
            disabled={isUpdating}
            onPress={() => onResolve(item.id)}
          >
            <View style={styles.buttonInner}>
              {isUpdating && actionType === "resolve" ? (
                <ActivityIndicator size="small" color="#22C55E" />
              ) : (
                <Ionicons name="checkmark" size={14} color="#22C55E" />
              )}
              <Text style={styles.approveText}>Approve</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.deleteBtn,
            isUpdating && actionType === "delete" && styles.disabledBtn,
          ]}
          disabled={isUpdating}
          onPress={() => onDelete(item.id)}
        >
          <View style={styles.buttonInner}>
            {isUpdating && actionType === "delete" ? (
              <ActivityIndicator size="small" color="#FCA5A5" />
            ) : (
              <Ionicons name="trash-outline" size={14} color="#FCA5A5" />
            )}
            <Text style={styles.deleteText}>Delete</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.viewBtn]}
          onPress={() => onViewUser(item.userId)}
        >
          <View style={styles.buttonInner}>
            <Ionicons name="person-outline" size={14} color="#A5B4FC" />
            <Text style={styles.viewText}>View User</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function SupportTicketsScreen() {
  const insets = useSafeAreaInsets();
  const {
    loading,
    loadingMore,
    searching,
    actionTicketId,
    actionType,
    searchInput,
    visibleTickets,
    hasMore,
    summary,
    setSearchInput,
    handleSearch,
    handleLoadMore,
    resolveTicket,
    deleteTicket,
  } = useAdminSupportTickets();

  const handleViewUser = useCallback((userId: string) => {
    router.push(`/user-detail?id=${userId}` as Href);
  }, []);

  const renderCard = useCallback(
    ({ item }: { item: AdminSupportTicket }) => (
      <TicketCard
        item={item}
        actionTicketId={actionTicketId}
        actionType={actionType}
        onResolve={resolveTicket}
        onDelete={deleteTicket}
        onViewUser={handleViewUser}
      />
    ),
    [actionTicketId, actionType, deleteTicket, handleViewUser, resolveTicket]
  );

  const keyExtractor = useCallback(
    (item: AdminSupportTicket) => item.id,
    []
  );

  const footerComponent = useMemo(() => {
    if (!hasMore) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.loadMoreBtn}
        onPress={handleLoadMore}
        disabled={loadingMore}
      >
        {loadingMore ? (
          <ActivityIndicator size="small" color="#F8FAFC" />
        ) : (
          <>
            <Text style={styles.loadMoreText}>Load More</Text>
            <Ionicons name="chevron-down" size={16} color="#F8FAFC" />
          </>
        )}
      </TouchableOpacity>
    );
  }, [handleLoadMore, hasMore, loadingMore]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Support Tickets <Text style={styles.count}>({summary.totalCount})</Text>
      </Text>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color="#94A3B8" />
          <TextInput
            placeholder="Search by email..."
            placeholderTextColor="#64748B"
            style={styles.input}
            value={searchInput}
            onChangeText={(value) => setSearchInput(value.toLowerCase())}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="search"
            onSubmitEditing={() => void handleSearch()}
          />
        </View>

        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => void handleSearch()}
          disabled={searching}
        >
          {searching ? (
            <ActivityIndicator size="small" color="#CBD5F5" />
          ) : (
            <Text style={styles.btnText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={visibleTickets}
        keyExtractor={keyExtractor}
        renderItem={renderCard}
        ListEmptyComponent={<EmptyState />}
        ListFooterComponent={footerComponent}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
