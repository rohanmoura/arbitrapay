import FullScreenLoader from "@/components/FullScreenLoader";
import {
  ActivationRequestCard,
  type ActivationRequestCardItem,
} from "@/components/admin-dashboard/ActivationRequestCard";
import { useAdminAccountActivations } from "@/hooks/useAdminAccountActivations";
import { styles } from "@/screens/admin-dashboard/BankAccounts.styles";
import {
  type AdminAccountActivationRequest,
} from "@/services/adminAccountActivationsService";
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

type FilterOption = "All" | "Activated" | "Not Activated";

const EmptyState = memo(function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No activation requests found.</Text>
    </View>
  );
});

export default function AccountActivationsScreen() {
  const { loading, requests, summary } = useAdminAccountActivations();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterOption>("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const insets = useSafeAreaInsets();

  const filteredRequests = useMemo(() => {
    const baseList = requests.filter((item) => {
      if (filter === "Activated") {
        return item.status === "approved";
      }

      if (filter === "Not Activated") {
        return item.status === "pending";
      }

      return true;
    });

    return [...baseList].sort((left, right) => {
      const leftCreated = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightCreated = right.createdAt ? new Date(right.createdAt).getTime() : 0;

      return rightCreated - leftCreated;
    });
  }, [filter, requests]);

  const orderedRequests = useMemo(() => {
    const normalizedSearch = searchEmail.trim().toLowerCase();

    if (!normalizedSearch) {
      return filteredRequests;
    }

    const matchingRequests = filteredRequests.filter(
      (item) => item.user.email?.trim().toLowerCase() === normalizedSearch
    );
    const remainingRequests = filteredRequests.filter(
      (item) => item.user.email?.trim().toLowerCase() !== normalizedSearch
    );

    return [...matchingRequests, ...remainingRequests];
  }, [filteredRequests, searchEmail]);

  const visibleRequests = useMemo(
    () => orderedRequests.slice(0, visibleCount),
    [orderedRequests, visibleCount]
  );

  const hasMore = orderedRequests.length > visibleCount;

  const handleSearch = useCallback(
    (value: string) => {
      const normalizedEmail = value.trim().toLowerCase();
      const hasMatch = normalizedEmail
        ? filteredRequests.some(
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
    [filteredRequests]
  );

  const handleFilterChange = useCallback((value: FilterOption) => {
    setFilter(value);
    setFilterOpen(false);
    setVisibleCount(PAGE_SIZE);
    setSearchEmail("");
  }, []);

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setVisibleCount((current) => current + PAGE_SIZE);
    setLoadingMore(false);
  }, []);

  const handleView = useCallback((item: AdminAccountActivationRequest) => {
    router.push(
      `/user-account-activations?requestId=${item.id}` as Href
    );
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: AdminAccountActivationRequest }) => (
      <ActivationRequestCard
        item={item as ActivationRequestCardItem}
        onView={(value) => handleView(value as AdminAccountActivationRequest)}
      />
    ),
    [handleView]
  );

  const keyExtractor = useCallback(
    (item: AdminAccountActivationRequest) => item.id,
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
        Account Activations <Text style={styles.count}>({summary.total})</Text>
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{summary.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{summary.activated}</Text>
          <Text style={styles.statLabel}>Activated</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{summary.notActivated}</Text>
          <Text style={styles.statLabel}>Not Activated</Text>
        </View>
      </View>

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
          onPress={() => setFilterOpen((current) => !current)}
        >
          <Text style={styles.sortText}>{filter}</Text>
          <Ionicons name="chevron-down" size={16} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {filterOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => handleFilterChange("All")}>
            <Text style={styles.dropdownItem}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleFilterChange("Activated")}>
            <Text style={styles.dropdownItem}>Activated</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleFilterChange("Not Activated")}>
            <Text style={styles.dropdownItem}>Not Activated</Text>
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
