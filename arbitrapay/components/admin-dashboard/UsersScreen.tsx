import FullScreenLoader from "@/components/FullScreenLoader";
import {
  type AdminUserProfileRecord,
  fetchActivatedUserIds,
  fetchAdminUserByEmail,
  fetchAdminUsers,
  fetchAdminUsersSummary,
  isUserSuspended,
  suspendAdminUser,
} from "@/services/adminUsersService";
import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
import { styles } from "@/screens/admin-dashboard/UsersScreen.styles";
import { router, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PAGE_SIZE = 20;

type SortOption = "A-Z" | "Z-A";

type SummaryState = {
  totalUsers: number;
  activeUsers: number;
  activatedUsers: number;
  suspendedUsers: number;
};

type DisplayUser = AdminUserProfileRecord & {
  activated: boolean;
};

const EMPTY_SUMMARY: SummaryState = {
  totalUsers: 0,
  activeUsers: 0,
  activatedUsers: 0,
  suspendedUsers: 0,
};

type UserCardProps = {
  item: DisplayUser;
  index: number;
  actionUserId: string | null;
  onViewUser: (userId: string) => void;
  onSuspendUser: (user: DisplayUser) => void;
};

const EmptyState = memo(function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No users found.</Text>
    </View>
  );
});

const UserCard = memo(function UserCard({
  item,
  index,
  actionUserId,
  onViewUser,
  onSuspendUser,
}: UserCardProps) {
  const name = item.name?.trim();
  const displayName = !name || name === "User" ? `User ${index + 1}` : name;
  const suspended = isUserSuspended(item.status);
  const avatarCharacter = displayName.charAt(0).toUpperCase();
  const isSuspending = actionUserId === item.id;

  return (
    <View style={styles.userCard}>
      <View style={styles.userTopRow}>
        <View style={styles.avatar}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{avatarCharacter}</Text>
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{item.email || "Not available"}</Text>
        </View>

        <View style={[styles.statusBadge, suspended ? styles.suspended : styles.active]}>
          <Text style={styles.statusText}>{suspended ? "Suspended" : "Active"}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.detail}>Phone: {item.phone?.trim() || "Not available"}</Text>
        <Text style={styles.detail}>Referral: Not given</Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.activation}>
          {item.activated ? "Activated Account" : "Not Activated"}
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.viewBtn} onPress={() => onViewUser(item.id)}>
            <Text style={styles.viewText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.suspendBtn, suspended && styles.suspendBtnDisabled]}
            disabled={suspended || isSuspending}
            onPress={() => onSuspendUser(item)}
          >
            {isSuspending ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Text style={styles.suspendText}>
                {suspended ? "Suspended" : "Suspend"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default function UsersScreen() {
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("A-Z");
  const [searchInput, setSearchInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [summary, setSummary] = useState<SummaryState>(EMPTY_SUMMARY);
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const insets = useSafeAreaInsets();

  const loadSummary = useCallback(async () => {
    const summaryData = await fetchAdminUsersSummary();
    setSummary(summaryData);
  }, []);

  const loadUsers = useCallback(
    async (nextVisibleCount: number, nextSort: SortOption, emailQuery: string) => {
      const normalizedEmail = emailQuery.trim().toLowerCase();

      const [orderedUsers, searchedUser] = await Promise.all([
        fetchAdminUsers(nextVisibleCount, nextSort),
        normalizedEmail
          ? fetchAdminUserByEmail(normalizedEmail)
          : Promise.resolve(null),
      ]);

      const combinedUsers = searchedUser
        ? [searchedUser, ...orderedUsers.filter((user) => user.id !== searchedUser.id)]
        : orderedUsers;
      const slicedUsers = combinedUsers.slice(0, nextVisibleCount);
      const activatedUserIds = await fetchActivatedUserIds(
        slicedUsers.map((user) => user.id)
      );

      setUsers(
        slicedUsers.map((user) => ({
          ...user,
          activated: activatedUserIds.has(user.id),
        }))
      );
    },
    []
  );

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        setLoading(true);
        await Promise.all([
          loadSummary(),
          loadUsers(PAGE_SIZE, "A-Z", ""),
        ]);

        if (active) {
          setVisibleCount(PAGE_SIZE);
        }
      } catch (error: any) {
        if (active) {
          Alert.alert(
            "Users Error",
            error.message || "Unable to load users right now."
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
  }, [loadSummary, loadUsers]);

  useEffect(() => {
    if (loading) {
      return;
    }

    let active = true;

    const syncSearch = async () => {
      try {
        await loadUsers(visibleCount, sort, searchEmail);
      } catch (error: any) {
        if (active) {
          Alert.alert(
            "Users Error",
            error.message || "Unable to refresh the user list."
          );
        }
      }
    };

    syncSearch();

    return () => {
      active = false;
    };
  }, [searchEmail, visibleCount, sort, loadUsers, loading]);

  const hasMore = useMemo(
    () => summary.totalUsers > users.length,
    [summary.totalUsers, users.length]
  );

  const handleLoadMore = useCallback(async () => {
    const nextVisibleCount = visibleCount + PAGE_SIZE;

    try {
      setLoadingMore(true);
      await loadUsers(nextVisibleCount, sort, searchEmail);
      setVisibleCount(nextVisibleCount);
    } catch (error: any) {
      Alert.alert(
        "Load More Error",
        error.message || "Unable to load more users."
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loadUsers, searchEmail, sort, visibleCount]);

  const handleViewUser = useCallback((userId: string) => {
    router.push(`/user-detail?id=${userId}` as Href);
  }, []);

  const handleSearch = async (nextSearchEmail: string) => {
    const normalizedEmail = nextSearchEmail.trim().toLowerCase();

    try {
      setSearching(true);
      setVisibleCount(PAGE_SIZE);
      setSearchEmail(normalizedEmail);
      await loadUsers(PAGE_SIZE, sort, normalizedEmail);
    } catch (error: any) {
      Alert.alert(
        "Search Error",
        error.message || "Unable to search for this user."
      );
    } finally {
      setSearching(false);
    }
  };

  const refreshUsers = useCallback(async (nextVisibleCount = visibleCount) => {
    await Promise.all([
      loadSummary(),
      loadUsers(nextVisibleCount, sort, searchEmail),
    ]);
  }, [loadSummary, loadUsers, searchEmail, sort, visibleCount]);

  const handleSuspendUser = useCallback((user: DisplayUser) => {
    Alert.alert(
      "Suspend User",
      "This user will be removed from system access, force logged out, and will not be able to log in again. Do you want to continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Suspend",
          style: "destructive",
          onPress: async () => {
            try {
              setActionUserId(user.id);
              await suspendAdminUser(user.id);
              await refreshUsers();
              Alert.alert("Success", "User has been suspended.");
            } catch (error: any) {
              Alert.alert(
                "Suspend Error",
                error.message || "Unable to suspend this user."
              );
            } finally {
              setActionUserId(null);
            }
          },
        },
      ]
    );
  }, [refreshUsers]);

  const renderUser = useCallback(
    ({ item, index }: { item: DisplayUser; index: number }) => (
      <UserCard
        item={item}
        index={index}
        actionUserId={actionUserId}
        onViewUser={handleViewUser}
        onSuspendUser={handleSuspendUser}
      />
    ),
    [actionUserId, handleSuspendUser, handleViewUser]
  );

  const keyExtractor = useCallback((item: DisplayUser) => item.id, []);

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
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          Users <Text style={styles.count}>({summary.totalUsers})</Text>
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{summary.totalUsers}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{summary.activeUsers}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{summary.activatedUsers}</Text>
          <Text style={styles.statLabel}>Activated</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{summary.suspendedUsers}</Text>
          <Text style={styles.statLabel}>Suspended</Text>
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
            <ActivityIndicator size="small" color="#E2E8F0" />
          ) : (
            <Text style={styles.searchBtnText}>Search</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.sortBtn} onPress={() => setSortOpen(!sortOpen)}>
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
        data={users}
        keyExtractor={keyExtractor}
        renderItem={renderUser}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 }
        ]}
        ListFooterComponent={footerComponent}
        ListEmptyComponent={EmptyState}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
      />
    </View>
  );
}
