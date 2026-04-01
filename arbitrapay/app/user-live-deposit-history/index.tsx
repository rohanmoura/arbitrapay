import FullScreenLoader from "@/components/FullScreenLoader";
import { useAdminLiveDepositHistory } from "@/hooks/useAdminLiveDepositHistory";
import { styles } from "@/screens/admin-dashboard/UserLiveDepositHistory.styles";
import { type AdminLiveDepositHistoryRecord } from "@/services/adminLiveDepositHistoryService";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 20;

type TimeFilter = "All" | "Last 24 hours" | "Last 7 days" | "Last 30 days";

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(",", " •");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function maskAccountNumber(accountNumber?: string | null) {
  if (!accountNumber) {
    return "Not available";
  }

  return `**** **** **** ${accountNumber.slice(-4)}`;
}

function getFilterCutoff(filter: TimeFilter) {
  const now = Date.now();

  switch (filter) {
    case "Last 24 hours":
      return now - 24 * 60 * 60 * 1000;
    case "Last 7 days":
      return now - 7 * 24 * 60 * 60 * 1000;
    case "Last 30 days":
      return now - 30 * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
}

type HistoryCardProps = {
  item: AdminLiveDepositHistoryRecord;
  onView: (item: AdminLiveDepositHistoryRecord) => void;
};

const HistoryCard = memo(function HistoryCard({ item, onView }: HistoryCardProps) {
  const [showFull, setShowFull] = useState(false);
  const displayName = item.user.name?.trim() || "User";
  const avatarCharacter = displayName.charAt(0).toUpperCase() || "U";
  const isCredit = item.type === "credit";
  const accent = isCredit ? "#22C55E" : "#EF4444";

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
          <Text style={[styles.amount, { color: accent }]}>
            {isCredit ? "+" : "-"}
            {formatCurrency(item.amount)}
          </Text>
          <Text style={styles.date}>{formatDateTime(item.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Info</Text>

        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={14} color="#94A3B8" />
          <Text style={styles.detailText}>
            {item.bankAccount.accountHolderName || displayName}
          </Text>
        </View>

        <View style={styles.accountRow}>
          <Ionicons name="card-outline" size={14} color="#94A3B8" />
          <Text style={styles.detailText}>
            {showFull
              ? item.bankAccount.accountNumber || "Not available"
              : maskAccountNumber(item.bankAccount.accountNumber)}
          </Text>
          <TouchableOpacity onPress={() => setShowFull((current) => !current)}>
            <Ionicons
              name={showFull ? "eye-off-outline" : "eye-outline"}
              size={16}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="git-branch-outline" size={14} color="#94A3B8" />
          <Text style={styles.detailText}>{item.bankAccount.ifscCode || "Not available"}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction Info</Text>

        <Text
          style={[
            styles.typeBadge,
            {
              color: accent,
              backgroundColor: isCredit
                ? "rgba(34,197,94,0.14)"
                : "rgba(239,68,68,0.14)",
            },
          ]}
        >
          {isCredit ? "Credit" : "Debit"}
        </Text>
        <Text style={styles.statusText}>Status: {item.status || "Not available"}</Text>
        {item.description ? (
          <Text style={styles.statusText}>{item.description}</Text>
        ) : null}
      </View>

      <View style={styles.bottomRow}>
        <View />

        <TouchableOpacity style={styles.viewBtn} onPress={() => onView(item)}>
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No live deposits found</Text>
    </View>
  );
});

export default function UserLiveDepositHistoryScreen() {
  const { loading, records, summary } = useAdminLiveDepositHistory();
  const [filterOpen, setFilterOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);

  const filteredRecords = useMemo(() => {
    const cutoff = getFilterCutoff(timeFilter);
    const baseList = records.filter((item) => {
      if (!cutoff) {
        return true;
      }

      if (!item.createdAt) {
        return false;
      }

      const createdTime = new Date(item.createdAt).getTime();

      if (Number.isNaN(createdTime)) {
        return false;
      }

      return createdTime >= cutoff;
    });

    return [...baseList].sort((left, right) => {
      const leftCreated = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightCreated = right.createdAt ? new Date(right.createdAt).getTime() : 0;

      return rightCreated - leftCreated;
    });
  }, [records, timeFilter]);

  const orderedRecords = useMemo(() => {
    const normalizedSearch = searchEmail.trim().toLowerCase();

    if (!normalizedSearch) {
      return filteredRecords;
    }

    const matching = filteredRecords.filter(
      (item) => item.user.email?.trim().toLowerCase() === normalizedSearch
    );
    const remaining = filteredRecords.filter(
      (item) => item.user.email?.trim().toLowerCase() !== normalizedSearch
    );

    return [...matching, ...remaining];
  }, [filteredRecords, searchEmail]);

  const visibleRecords = useMemo(
    () => orderedRecords.slice(0, visibleCount),
    [orderedRecords, visibleCount]
  );

  const hasMore = orderedRecords.length > visibleCount;

  const handleSearch = useCallback(
    (value: string) => {
      const normalizedEmail = value.trim().toLowerCase();
      const hasMatch = normalizedEmail
        ? filteredRecords.some(
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
    [filteredRecords]
  );

  const handleFilterChange = useCallback((value: TimeFilter) => {
    setTimeFilter(value);
    setFilterOpen(false);
    setVisibleCount(PAGE_SIZE);
    setSearchEmail("");
  }, []);

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setVisibleCount((current) => current + PAGE_SIZE);
    setLoadingMore(false);
  }, []);

  const handleView = useCallback((item: AdminLiveDepositHistoryRecord) => {
    if (!item.requestId) {
      Alert.alert("Live Deposit", "Unable to find the related approved activation request.");
      return;
    }

    router.push(`/user-live-deposit?requestId=${item.requestId}` as Href);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: AdminLiveDepositHistoryRecord }) => (
      <HistoryCard item={item} onView={handleView} />
    ),
    [handleView]
  );

  const keyExtractor = useCallback((item: AdminLiveDepositHistoryRecord) => item.id, []);

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
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={visibleRecords}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color="#E2E8F0" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Live Deposit History</Text>

              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{summary.totalUsersWithDeposits}</Text>
                <Text style={styles.statLabel}>Total Users with Deposits</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{summary.totalActivatedAccounts}</Text>
                <Text style={styles.statLabel}>Total Activated Accounts</Text>
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
                style={styles.filterBtn}
                onPress={() => setFilterOpen((current) => !current)}
              >
                <Text style={styles.filterText}>{timeFilter}</Text>
                <Ionicons name="chevron-down" size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {filterOpen && (
              <View style={styles.dropdown}>
                <TouchableOpacity onPress={() => handleFilterChange("All")}>
                  <Text style={styles.dropdownItem}>All</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleFilterChange("Last 24 hours")}>
                  <Text style={styles.dropdownItem}>Last 24 hours</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleFilterChange("Last 7 days")}>
                  <Text style={styles.dropdownItem}>Last 7 days</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleFilterChange("Last 30 days")}>
                  <Text style={styles.dropdownItem}>Last 30 days</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
        ListFooterComponent={footerComponent}
        ListEmptyComponent={EmptyState}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
