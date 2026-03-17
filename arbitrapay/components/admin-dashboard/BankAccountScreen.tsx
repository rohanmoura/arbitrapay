import FullScreenLoader from "@/components/FullScreenLoader";
import {
  fetchAdminBankAccountsData,
  type AdminBankAccountRecord,
} from "@/services/adminBankAccountsService";
import { isUserSuspended } from "@/services/adminUsersService";
import { styles } from "@/screens/admin-dashboard/BankAccounts.styles";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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

const PAGE_SIZE = 20;

type SortOption = "A-Z" | "Z-A";

type SummaryState = {
  totalBankAccounts: number;
  activatedBankAccounts: number;
};

const EMPTY_SUMMARY: SummaryState = {
  totalBankAccounts: 0,
  activatedBankAccounts: 0,
};

function formatCreatedAt(value?: string | null) {
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

  return `${datePart}, (${timePart})`;
}

function maskAccountNumber(accountNumber: string) {
  return `**** **** **** ${accountNumber.slice(-4)}`;
}

function BankAccountCard({ item }: { item: AdminBankAccountRecord }) {
  const [showFull, setShowFull] = useState(false);
  const suspended = isUserSuspended(item.user.status);
  const displayName =
    !item.user.name?.trim() || item.user.name.trim() === "User"
      ? "User"
      : item.user.name.trim();
  const avatarCharacter = displayName.charAt(0).toUpperCase() || "U";

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

        <View
          style={[
            styles.badge,
            suspended ? styles.suspended : styles.active,
          ]}
        >
          <Text style={styles.badgeText}>
            {suspended ? "Suspended" : "Active"}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={14} color="#94A3B8" />
          <Text style={styles.detail}>Holder: {item.accountHolderName}</Text>
        </View>

        <View style={styles.accountRow}>
          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={14} color="#94A3B8" />
            <Text style={styles.detail}>
              Acc: {showFull ? item.accountNumber : maskAccountNumber(item.accountNumber)}
            </Text>
          </View>

          <TouchableOpacity onPress={() => setShowFull((current) => !current)}>
            <Ionicons
              name={showFull ? "eye-off-outline" : "eye-outline"}
              size={16}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
          <Text style={styles.detail}>Created: {formatCreatedAt(item.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.activation}>
          {item.activated ? "Activated" : "Not Activated"}
        </Text>

        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => router.push(`/user-bank-account?id=${item.id}` as Href)}
        >
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function BankAccountsScreen() {
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("A-Z");
  const [searchInput, setSearchInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [summary, setSummary] = useState<SummaryState>(EMPTY_SUMMARY);
  const [allAccounts, setAllAccounts] = useState<AdminBankAccountRecord[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        setLoading(true);
        const { accounts, summary } = await fetchAdminBankAccountsData();

        if (!active) {
          return;
        }

        setAllAccounts(accounts);
        setSummary(summary);
      } catch (error: any) {
        if (active) {
          Alert.alert(
            "Bank Accounts Error",
            error.message || "Unable to load bank accounts right now."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, []);

  const sortedAccounts = useMemo(() => {
    const ordered = [...allAccounts].sort((left, right) => {
      const leftEmail = left.user.email?.toLowerCase() || "";
      const rightEmail = right.user.email?.toLowerCase() || "";
      const comparison = leftEmail.localeCompare(rightEmail);

      if (comparison !== 0) {
        return sort === "A-Z" ? comparison : -comparison;
      }

      const leftCreated = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightCreated = right.createdAt ? new Date(right.createdAt).getTime() : 0;

      return rightCreated - leftCreated;
    });

    const normalizedSearch = searchEmail.trim().toLowerCase();

    if (!normalizedSearch) {
      return ordered;
    }

    const matchingAccounts = ordered.filter(
      (account) => account.user.email?.toLowerCase() === normalizedSearch
    );
    const remainingAccounts = ordered.filter(
      (account) => account.user.email?.toLowerCase() !== normalizedSearch
    );

    return [...matchingAccounts, ...remainingAccounts];
  }, [allAccounts, searchEmail, sort]);

  const visibleAccounts = useMemo(
    () => sortedAccounts.slice(0, visibleCount),
    [sortedAccounts, visibleCount]
  );

  const hasMore = sortedAccounts.length > visibleCount;

  const handleSearch = async (value: string) => {
    const normalizedEmail = value.trim().toLowerCase();

    setSearching(true);
    setVisibleCount(PAGE_SIZE);
    setSearchEmail(normalizedEmail);
    setSearching(false);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setVisibleCount((current) => current + PAGE_SIZE);
    setLoadingMore(false);
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bank Accounts <Text style={styles.count}>({summary.totalBankAccounts})</Text>
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{summary.totalBankAccounts}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{summary.activatedBankAccounts}</Text>
          <Text style={styles.statLabel}>Activated</Text>
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
          onPress={() => setSortOpen((current) => !current)}
        >
          <Text style={styles.sortText}>{sort}</Text>
          <Ionicons name="chevron-down" size={16} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {sortOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            onPress={() => {
              setSort("A-Z");
              setSortOpen(false);
              setVisibleCount(PAGE_SIZE);
            }}
          >
            <Text style={styles.dropdownItem}>A → Z</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSort("Z-A");
              setSortOpen(false);
              setVisibleCount(PAGE_SIZE);
            }}
          >
            <Text style={styles.dropdownItem}>Z → A</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={visibleAccounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BankAccountCard item={item} />}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          hasMore ? (
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
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No bank accounts found.</Text>
          </View>
        }
      />
    </View>
  );
}
