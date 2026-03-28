import FullScreenLoader from "@/components/FullScreenLoader";
import {
  type SecurityDepositDateFilter,
  type SecurityDepositTab,
  useAdminSecurityDeposits,
} from "@/hooks/useAdminSecurityDeposits";
import { styles } from "@/screens/admin-dashboard/SecurityDeposistsRequests.styles";
import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback, useMemo, useState } from "react";
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

type SecurityDepositCardItem = {
  id: string;
  depositMethod: "UPI" | "BANK_TRANSFER";
  amount: number;
  createdAt: string | null;
  user: {
    avatar: string | null;
    email: string | null;
    name: string | null;
  };
  bankAccount: {
    bankName: string | null;
    accountNumber: string | null;
  } | null;
};

const DATE_FILTER_OPTIONS: {
  key: SecurityDepositDateFilter;
  label: string;
  shortLabel: string;
}[] = [
  { key: "all", label: "All Time", shortLabel: "All" },
  { key: "24h", label: "Last 24 hours", shortLabel: "24h" },
  { key: "7d", label: "Last 7 days", shortLabel: "7d" },
  { key: "30d", label: "Last 30 days", shortLabel: "30d" },
];

const TAB_LABELS: Record<SecurityDepositTab, string> = {
  new: "New",
  approved: "Approved",
  pending: "Pending",
};

function maskAccountNumber(accountNumber?: string | null) {
  if (!accountNumber) {
    return "Bank details not provided";
  }

  const lastFourDigits = accountNumber.slice(-4);
  return `**** **** **** ${lastFourDigits}`;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

function formatDate(value?: string | null) {
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

function formatPaymentMethod(method: "UPI" | "BANK_TRANSFER") {
  return method === "BANK_TRANSFER" ? "Bank Transfer" : "UPI";
}

type SecurityDepositCardProps = {
  item: SecurityDepositCardItem;
  tab: SecurityDepositTab;
  actionDepositId: string | null;
  actionStatus: "approved" | "pending" | null;
  onApprove: (depositId: string) => void;
  onPending: (depositId: string) => void;
};

const SecurityDepositCard = memo(function SecurityDepositCard({
  item,
  tab,
  actionDepositId,
  actionStatus,
  onApprove,
  onPending,
}: SecurityDepositCardProps) {
  const displayName =
    !item.user.name?.trim() || item.user.name.trim() === "User"
      ? "User"
      : item.user.name.trim();
  const avatarCharacter = displayName.charAt(0).toUpperCase() || "U";
  const bankName = item.bankAccount?.bankName?.trim() || "Bank details not provided";
  const accountNumberLabel = item.bankAccount?.accountNumber
    ? maskAccountNumber(item.bankAccount.accountNumber)
    : "Bank details not provided";
  const isUpdating = actionDepositId === item.id;

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

        <View style={styles.amountWrap}>
          <Text style={styles.amount}>₹ {formatAmount(item.amount)}</Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.methodRow}>
        <View style={styles.methodChip}>
          <Ionicons
            name={item.depositMethod === "UPI" ? "flash-outline" : "card-outline"}
            size={12}
            color="#A78BFA"
          />
          <Text style={styles.methodText}>{formatPaymentMethod(item.depositMethod)}</Text>
        </View>

        {tab !== "new" && (
          <View
            style={[
              styles.badge,
              tab === "approved" ? styles.approvedBadge : styles.pendingBadge,
            ]}
          >
            <Text style={styles.badgeText}>{TAB_LABELS[tab]}</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={14} color="#94A3B8" />
          <Text style={styles.detail}>{bankName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={14} color="#94A3B8" />
          <Text style={styles.detail}>{accountNumberLabel}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {tab !== "approved" && (
          <TouchableOpacity
            style={[styles.approveBtn, isUpdating && actionStatus === "approved" && styles.disabledBtn]}
            disabled={isUpdating}
            onPress={() => onApprove(item.id)}
          >
            <View style={styles.btnInner}>
              {isUpdating && actionStatus === "approved" ? (
                <ActivityIndicator size="small" color="#22C55E" />
              ) : (
                <Ionicons name="checkmark" size={14} color="#22C55E" />
              )}
              <Text style={styles.approveText}>Approve</Text>
            </View>
          </TouchableOpacity>
        )}

        {tab !== "pending" && (
          <TouchableOpacity
            style={[styles.pendingBtn, isUpdating && actionStatus === "pending" && styles.disabledBtn]}
            disabled={isUpdating}
            onPress={() => onPending(item.id)}
          >
            <View style={styles.btnInner}>
              {isUpdating && actionStatus === "pending" ? (
                <ActivityIndicator size="small" color="#FBBF24" />
              ) : (
                <Ionicons name="time-outline" size={14} color="#FBBF24" />
              )}
              <Text style={styles.pendingText}>Pending</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.viewBtn, styles.viewBtnDisabled]} disabled>
          <View style={styles.btnInner}>
            <Ionicons name="eye-outline" size={14} color="#A5B4FC" />
            <Text style={styles.viewText}>View</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const EmptyState = memo(function EmptyState({
  tab,
}: {
  tab: SecurityDepositTab;
}) {
  const message = useMemo(() => {
    if (tab === "approved") {
      return "No approved requests yet. Approve a request to see it here.";
    }

    if (tab === "pending") {
      return "No requests marked as pending.";
    }

    return "No new requests yet. Please wait...";
  }, [tab]);

  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );
});

export default function SecurityDeposistsRequests() {
  const insets = useSafeAreaInsets();
  const {
    loading,
    loadingMore,
    searching,
    actionDepositId,
    actionStatus,
    activeTab,
    dateFilter,
    searchInput,
    visibleDeposits,
    hasMore,
    summary,
    setSearchInput,
    handleSearch,
    handleSetTab,
    handleSetDateFilter,
    handleLoadMore,
    approveDeposit,
    markDepositPending,
  } = useAdminSecurityDeposits();
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const activeDateFilter = useMemo(
    () => DATE_FILTER_OPTIONS.find((option) => option.key === dateFilter) || DATE_FILTER_OPTIONS[0],
    [dateFilter]
  );

  const tabs = useMemo(
    () => [
      { key: "new" as const, label: "New", count: summary.newCount },
      { key: "approved" as const, label: "Approved", count: summary.approvedCount },
      { key: "pending" as const, label: "Pending", count: summary.pendingCount },
    ],
    [summary.approvedCount, summary.newCount, summary.pendingCount]
  );

  const renderCard = useCallback(
    ({ item }: { item: SecurityDepositCardItem }) => (
      <SecurityDepositCard
        item={item}
        tab={activeTab}
        actionDepositId={actionDepositId}
        actionStatus={actionStatus}
        onApprove={approveDeposit}
        onPending={markDepositPending}
      />
    ),
    [actionDepositId, actionStatus, activeTab, approveDeposit, markDepositPending]
  );

  const keyExtractor = useCallback((item: SecurityDepositCardItem) => item.id, []);

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
        Security Deposits <Text style={styles.count}>({summary.totalCount})</Text>
      </Text>

      <View style={styles.amountStrip}>
        <View>
          <Text style={styles.amountLabel}>Total Security Amount</Text>
          <Text style={styles.amountMain}>₹ {formatAmount(summary.totalAmount)}</Text>
        </View>

        <Ionicons name="wallet-outline" size={22} color="#22C55E" />
      </View>

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
          style={styles.filterBtn}
          onPress={() => setFilterMenuOpen((current) => !current)}
        >
          <Ionicons name="filter-outline" size={16} color="#CBD5F5" />
          <Text style={styles.filterText}>{activeDateFilter.shortLabel}</Text>
        </TouchableOpacity>

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

      {filterMenuOpen && (
        <View style={styles.dropdown}>
          {DATE_FILTER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={styles.dropdownItemRow}
              onPress={() => {
                handleSetDateFilter(option.key);
                setFilterMenuOpen(false);
              }}
            >
              <Text style={styles.dropdownItem}>{option.label}</Text>
              {dateFilter === option.key && (
                <Ionicons name="checkmark" size={16} color="#CBD5F5" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.tabs}>
        {tabs.map((tabItem) => (
          <TouchableOpacity
            key={tabItem.key}
            style={[styles.tab, activeTab === tabItem.key && styles.activeTab]}
            onPress={() => handleSetTab(tabItem.key)}
          >
            <Text style={styles.tabText}>
              {tabItem.label} ({tabItem.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={visibleDeposits}
        keyExtractor={keyExtractor}
        renderItem={renderCard}
        ListEmptyComponent={<EmptyState tab={activeTab} />}
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
