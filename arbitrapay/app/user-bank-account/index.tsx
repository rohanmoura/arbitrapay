import FullScreenLoader from "@/components/FullScreenLoader";
import { getProfileDisplayName } from "@/services/profileService";
import {
  fetchAdminUserBankAccounts,
  type AdminUserBankAccountItem,
} from "@/services/adminUserBankAccountsService";
import { styles } from "@/screens/admin-dashboard/UserBankAccount.styles";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type UserBankAccountsState = Awaited<ReturnType<typeof fetchAdminUserBankAccounts>>;

function maskAccountNumber(accountNumber: string) {
  return `**** ${accountNumber.slice(-4)}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

type AccountListItem = {
  itemType: "primary" | "other";
  account: AdminUserBankAccountItem;
};

type AccountCardProps = {
  item: AdminUserBankAccountItem;
  isPrimary?: boolean;
  isVisible: boolean;
  onToggleVisibility: (accountId: string) => void;
  onViewDetails: (account: AdminUserBankAccountItem) => void;
};

const EMPTY_ACCOUNTS: AdminUserBankAccountItem[] = [];
const HEADER_SPACER_STYLE = { width: 22 } as const;

const AccountCard = memo(function AccountCard({
  item,
  isPrimary = false,
  isVisible,
  onToggleVisibility,
  onViewDetails,
}: AccountCardProps) {
  const handleToggleVisibility = useCallback(() => {
    onToggleVisibility(item.id);
  }, [item.id, onToggleVisibility]);

  return (
    <View style={isPrimary ? styles.primaryCard : styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.bankName}>{item.bankName}</Text>

        {isPrimary && (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryText}>Primary</Text>
          </View>
        )}
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={14} color="#64748B" />
          <Text style={styles.detailText}>{item.accountHolderName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={14} color="#64748B" />
          <Text style={styles.detailText}>
            {isVisible ? item.accountNumber : maskAccountNumber(item.accountNumber)}
          </Text>

          <TouchableOpacity onPress={handleToggleVisibility}>
            <Ionicons
              name={isVisible ? "eye-off-outline" : "eye-outline"}
              size={16}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={14} color="#64748B" />
          <Text style={styles.detailText}>{item.ifscCode}</Text>
        </View>
      </View>

      <View style={styles.tagRow}>
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      <View style={styles.tabsRow}>
        <View style={styles.tab}>
          <Text style={styles.tabLabel}>Deposit</Text>
          <Text style={styles.tabValue}>{formatCurrency(item.totalDeposits || 0)}</Text>
        </View>

        <View style={styles.tab}>
          <Text style={styles.tabLabel}>Activated</Text>
          <Text style={styles.tabValue}>{item.isActivated ? "True" : "False"}</Text>
        </View>
      </View>

      {item.isActivated && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.viewBtn} onPress={() => onViewDetails(item)}>
            <Text style={styles.viewText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

export default function UserBankAccountScreen() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const resolvedUserId = useMemo(
    () => (Array.isArray(userId) ? userId[0] : userId),
    [userId]
  );

  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});
  const [data, setData] = useState<UserBankAccountsState>(null);
  const [loading, setLoading] = useState(true);
  const lastFetchedUserIdRef = useRef<string | null>(null);
  const insets = useSafeAreaInsets();

  const toggleVisibility = useCallback((accountId: string) => {
    setVisibleMap((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  }, []);

  useEffect(() => {
    if (typeof resolvedUserId === "undefined") {
      return;
    }

    if (!resolvedUserId) {
      Alert.alert("User Error", "No user was selected.");
      router.back();
      setLoading(false);
      return;
    }

    if (lastFetchedUserIdRef.current === resolvedUserId) {
      return;
    }

    let active = true;
    lastFetchedUserIdRef.current = resolvedUserId;

    const run = async () => {
      if (!resolvedUserId) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetchAdminUserBankAccounts(resolvedUserId);

        if (!active) {
          return;
        }

        if (!response) {
          Alert.alert("User Error", "Unable to find this user's bank accounts.");
          router.back();
          return;
        }

        setData(response);
      } catch (error: any) {
        if (active) {
          Alert.alert(
            "Bank Accounts Error",
            error.message || "Unable to load this user's bank accounts right now."
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
  }, [resolvedUserId]);

  const primaryAccount = data?.primaryAccount ?? null;
  const otherAccounts = data?.otherAccounts ?? EMPTY_ACCOUNTS;
  const totalAccounts = data?.totalAccounts ?? 0;
  const displayName = getProfileDisplayName(data?.user.name);
  const avatarFallback = displayName.charAt(0).toUpperCase() || "U";

  const allAccountsEmpty = useMemo(
    () => !primaryAccount && otherAccounts.length === 0,
    [otherAccounts.length, primaryAccount]
  );

  const accountItems = useMemo(
    () => [
      ...(primaryAccount
        ? [{ itemType: "primary" as const, account: primaryAccount }]
        : []),
      ...otherAccounts.map((account) => ({
        itemType: "other" as const,
        account,
      })),
    ],
    [otherAccounts, primaryAccount]
  );

  const renderAccountCard = useCallback(
    ({ item }: { item: AccountListItem }) => (
      <View>
        {item.itemType === "primary" && (
          <Text style={styles.sectionLabel}>Primary Account</Text>
        )}
        {item.itemType === "other" && item.account.id === otherAccounts[0]?.id && (
          <Text style={styles.sectionLabel}>Other Accounts</Text>
        )}

        <AccountCard
          item={item.account}
          isPrimary={item.itemType === "primary"}
          isVisible={Boolean(visibleMap[item.account.id])}
          onToggleVisibility={toggleVisibility}
          onViewDetails={(account) =>
            router.push(
              `/user-account-activations?userId=${data?.user.id}&bankAccountId=${account.id}` as any
            )
          }
        />
      </View>
    ),
    [data?.user.id, otherAccounts, toggleVisibility, visibleMap]
  );

  const keyExtractor = useCallback((item: AccountListItem) => item.account.id, []);

  const headerComponent = useMemo(
    () => (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#E2E8F0" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>User Bank Accounts</Text>

          <View style={HEADER_SPACER_STYLE} />
        </View>

        {data && (
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              {data.user.avatar ? (
                <Image source={{ uri: data.user.avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{avatarFallback}</Text>
              )}
            </View>

            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{data.user.email}</Text>

            <Text style={styles.accountCount}>{totalAccounts} Bank Accounts</Text>
          </View>
        )}

        {allAccountsEmpty && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No bank accounts found.</Text>
          </View>
        )}
      </>
    ),
    [allAccountsEmpty, avatarFallback, displayName, totalAccounts, data]
  );

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={accountItems}
        keyExtractor={keyExtractor}
        renderItem={renderAccountCard}
        ListHeaderComponent={headerComponent}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 100 },
        ]}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
