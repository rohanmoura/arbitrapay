import FullScreenLoader from "@/components/FullScreenLoader";
import {
  type WithdrawalCardItem,
  type WithdrawalCardTab,
  WithdrawalRequestCard,
} from "@/components/admin-dashboard/WithdrawalRequestCard";
import {
  type WithdrawalDateFilter,
  type WithdrawalTab,
  useAdminWithdrawals,
} from "@/hooks/useAdminWithdrawals";
import { styles } from "@/screens/admin-dashboard/WithdrawalsRequests.styles";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DATE_FILTER_OPTIONS: {
  key: WithdrawalDateFilter;
  label: string;
  shortLabel: string;
}[] = [
  { key: "all", label: "All Time", shortLabel: "All" },
  { key: "24h", label: "Last 24 hours", shortLabel: "24h" },
  { key: "7d", label: "Last 7 days", shortLabel: "7d" },
  { key: "30d", label: "Last 30 days", shortLabel: "30d" },
];

const EmptyState = memo(function EmptyState({ tab }: { tab: WithdrawalTab }) {
  const message = useMemo(() => {
    if (tab === "approved") {
      return "No approved withdrawals yet.";
    }

    if (tab === "pending") {
      return "No pending withdrawals right now.";
    }

    return "No withdrawal requests found.";
  }, [tab]);

  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );
});

export default function WithdrawalsRequests() {
  const insets = useSafeAreaInsets();
  const {
    loading,
    loadingMore,
    searching,
    actionWithdrawalId,
    actionStatus,
    activeTab,
    dateFilter,
    searchInput,
    visibleWithdrawals,
    hasMore,
    summary,
    setSearchInput,
    handleSearch,
    handleSetTab,
    handleSetDateFilter,
    handleLoadMore,
    approveWithdrawal,
    markWithdrawalPending,
  } = useAdminWithdrawals();
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const activeDateFilter = useMemo(
    () =>
      DATE_FILTER_OPTIONS.find((option) => option.key === dateFilter) ||
      DATE_FILTER_OPTIONS[0],
    [dateFilter]
  );

  const tabs = useMemo(
    () => [
      { key: "total" as const, label: "Total Requests", count: summary.totalCount },
      { key: "approved" as const, label: "Approved", count: summary.approvedCount },
      { key: "pending" as const, label: "Pending", count: summary.pendingCount },
    ],
    [summary.approvedCount, summary.pendingCount, summary.totalCount]
  );

  const handleViewWithdrawal = useCallback((withdrawalId: string, _tab: WithdrawalCardTab) => {
    router.push(`/user-withdrawal?withdrawalId=${withdrawalId}` as Href);
  }, []);

  const renderCard = useCallback(
    ({ item }: { item: WithdrawalCardItem }) => (
      <WithdrawalRequestCard
        item={item}
        tab={activeTab}
        actionWithdrawalId={actionWithdrawalId}
        actionStatus={actionStatus}
        onApprove={approveWithdrawal}
        onPending={markWithdrawalPending}
        onView={handleViewWithdrawal}
      />
    ),
    [
      actionStatus,
      actionWithdrawalId,
      activeTab,
      approveWithdrawal,
      handleViewWithdrawal,
      markWithdrawalPending,
    ]
  );

  const keyExtractor = useCallback((item: WithdrawalCardItem) => item.id, []);

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
        Withdrawals <Text style={styles.count}>({summary.totalCount})</Text>
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
        data={visibleWithdrawals}
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
