import FullScreenLoader from "@/components/FullScreenLoader";
import {
  ActivationRequestCard,
  type ActivationRequestCardItem,
} from "@/components/admin-dashboard/ActivationRequestCard";
import { useAdminLiveDeposits } from "@/hooks/useAdminLiveDeposits";
import { styles } from "@/screens/admin-dashboard/LiveDeposit.styles";
import { type AdminLiveDepositRecord } from "@/services/adminLiveDepositsService";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PAGE_SIZE = 20;

type SortOption = "LATEST" | "A-Z" | "Z-A";

const EmptyState = memo(function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No activated accounts found.</Text>
    </View>
  );
});

export default function LiveDepositScreen() {
  const { loading, requests, totalActivatedAccounts } = useAdminLiveDeposits();
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("LATEST");
  const [searchInput, setSearchInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const insets = useSafeAreaInsets();

  const orderedRequests = useMemo(() => {
    const byEmail = [...requests];

    if (sort === "A-Z" || sort === "Z-A") {
      byEmail.sort((left, right) => {
        const leftEmail = left.user.email?.trim().toLowerCase() || "";
        const rightEmail = right.user.email?.trim().toLowerCase() || "";
        const comparison = leftEmail.localeCompare(rightEmail);

        if (comparison !== 0) {
          return sort === "A-Z" ? comparison : -comparison;
        }

        const leftCreated = left.createdAt ? new Date(left.createdAt).getTime() : 0;
        const rightCreated = right.createdAt ? new Date(right.createdAt).getTime() : 0;

        return rightCreated - leftCreated;
      });
    } else {
      byEmail.sort((left, right) => {
        const leftCreated = left.createdAt ? new Date(left.createdAt).getTime() : 0;
        const rightCreated = right.createdAt ? new Date(right.createdAt).getTime() : 0;

        return rightCreated - leftCreated;
      });
    }

    const normalizedSearch = searchEmail.trim().toLowerCase();

    if (!normalizedSearch) {
      return byEmail;
    }

    const matchingRequests = byEmail.filter(
      (item) => item.user.email?.trim().toLowerCase() === normalizedSearch
    );
    const remainingRequests = byEmail.filter(
      (item) => item.user.email?.trim().toLowerCase() !== normalizedSearch
    );

    return [...matchingRequests, ...remainingRequests];
  }, [requests, searchEmail, sort]);

  const visibleRequests = useMemo(
    () => orderedRequests.slice(0, visibleCount),
    [orderedRequests, visibleCount]
  );

  const hasMore = orderedRequests.length > visibleCount;

  const handleSearch = useCallback(
    (value: string) => {
      const normalizedEmail = value.trim().toLowerCase();
      const hasMatch = normalizedEmail
        ? requests.some(
            (item) => item.user.email?.trim().toLowerCase() === normalizedEmail
          )
        : true;

      setSearching(true);
      setVisibleCount(PAGE_SIZE);
      setSearchEmail(normalizedEmail);

      if (normalizedEmail && !hasMatch) {
        Alert.alert("Search", "User not found");
      }

      setSearching(false);
    },
    [requests]
  );

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setVisibleCount((current) => current + PAGE_SIZE);
    setLoadingMore(false);
  }, []);

  const handleSortChange = useCallback((value: Extract<SortOption, "A-Z" | "Z-A">) => {
    setSort(value);
    setSortOpen(false);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleSend = useCallback((item: ActivationRequestCardItem) => {
    router.push(`/user-live-deposit?requestId=${item.id}` as Href);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: AdminLiveDepositRecord }) => (
      <ActivationRequestCard
        item={item as ActivationRequestCardItem}
        actionLabel="Send"
        onView={handleSend}
      />
    ),
    [handleSend]
  );

  const keyExtractor = useCallback((item: AdminLiveDepositRecord) => item.id, []);

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
      <Text style={styles.title}>Live Deposits</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalActivatedAccounts}</Text>
          <Text style={styles.statLabel}>Total Activated Accounts</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.historyBtn}
        onPress={() => router.push("/user-live-deposit-history" as Href)}
      >
        <Ionicons name="time-outline" size={16} color="#CBD5F5" />
        <Text style={styles.historyBtnText}>See Live Deposit History</Text>
      </TouchableOpacity>

      <View style={styles.controls}>
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
            onSubmitEditing={() => handleSearch(searchInput)}
          />
        </View>

        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => handleSearch(searchInput)}
          disabled={searching}
        >
          {searching ? (
            <ActivityIndicator size="small" color="#CBD5F5" />
          ) : (
            <Text style={styles.searchBtnText}>Search</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setSortOpen((current) => !current)}
        >
          <Text style={styles.sortText}>
            {sort === "LATEST" ? "Sort" : sort}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {sortOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => handleSortChange("A-Z")}>
            <Text style={styles.dropdownItem}>A → Z</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSortChange("Z-A")}>
            <Text style={styles.dropdownItem}>Z → A</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={visibleRequests}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        ListFooterComponent={footerComponent}
        ListEmptyComponent={EmptyState}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
