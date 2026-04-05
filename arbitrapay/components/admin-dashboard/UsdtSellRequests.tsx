import FullScreenLoader from "@/components/FullScreenLoader";
import {
  type UsdtSellDateFilter,
  useAdminUsdtSell,
} from "@/hooks/useAdminUsdtSell";
import {
  type UsdtSellCardItem,
  UsdtSellRequestCard,
} from "@/components/admin-dashboard/UsdtSellRequestCard";
import { styles } from "@/screens/admin-dashboard/SecurityDeposistsRequests.styles";
import { Ionicons } from "@expo/vector-icons";
import { memo, useMemo, useState } from "react";
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
  key: UsdtSellDateFilter;
  label: string;
  shortLabel: string;
}[] = [
  { key: "all", label: "All Time", shortLabel: "All" },
  { key: "24h", label: "Last 24 hours", shortLabel: "24h" },
  { key: "7d", label: "Last 7 days", shortLabel: "7d" },
  { key: "30d", label: "Last 30 days", shortLabel: "30d" },
];

function formatUsdtAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 8,
  }).format(amount);
}

const EmptyState = memo(function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No USDT sell requests available.</Text>
    </View>
  );
});

export default function UsdtSellRequests() {
  const insets = useSafeAreaInsets();
  const {
    loading,
    loadingMore,
    searching,
    dateFilter,
    searchInput,
    visibleRequests,
    hasMore,
    summary,
    setSearchInput,
    handleSearch,
    handleSetDateFilter,
    handleLoadMore,
  } = useAdminUsdtSell();
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const activeDateFilter = useMemo(
    () => DATE_FILTER_OPTIONS.find((option) => option.key === dateFilter) || DATE_FILTER_OPTIONS[0],
    [dateFilter]
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
        USDT Requests <Text style={styles.count}>({summary.totalCount})</Text>
      </Text>

      <View style={styles.amountStrip}>
        <View>
          <Text style={styles.amountLabel}>Total USDT Amount</Text>
          <Text style={styles.amountMain}>$ {formatUsdtAmount(summary.totalAmountUsdt)}</Text>
        </View>

        <Ionicons name="logo-bitcoin" size={22} color="#22C55E" />
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
        <View style={[styles.tab, styles.activeTab]}>
          <Text style={styles.tabText}>All ({summary.totalCount})</Text>
        </View>
      </View>

      <FlatList
        data={visibleRequests}
        keyExtractor={(item: UsdtSellCardItem) => item.id}
        renderItem={({ item }: { item: UsdtSellCardItem }) => (
          <UsdtSellRequestCard item={item} />
        )}
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
