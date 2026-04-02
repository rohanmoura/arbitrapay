import FullScreenLoader from "@/components/FullScreenLoader";
import { getProfileDisplayName } from "@/services/profileService";
import {
  WithdrawalRequestCard,
  formatWithdrawalAmount,
  formatWithdrawalDate,
  type WithdrawalCardTab,
} from "@/components/admin-dashboard/WithdrawalRequestCard";
import { useAdminWithdrawalDetails } from "@/hooks/useAdminWithdrawalDetails";
import { styles } from "@/screens/admin-dashboard/UserWithdrawal.styles";
import { Ionicons } from "@expo/vector-icons";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function maskAccountNumber(accountNumber?: string | null) {
  if (!accountNumber) {
    return "Bank details not provided";
  }

  return `**** **** **** ${accountNumber.slice(-4)}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function UserWithdrawal() {
  const params = useLocalSearchParams<{
    withdrawalId?: string | string[];
    tab?: WithdrawalCardTab | WithdrawalCardTab[];
  }>();
  const resolvedWithdrawalId = useMemo(
    () => (Array.isArray(params.withdrawalId) ? params.withdrawalId[0] : params.withdrawalId),
    [params.withdrawalId]
  );
  const requestedTab = useMemo(() => {
    const value = Array.isArray(params.tab) ? params.tab[0] : params.tab;

    if (value === "approved" || value === "pending" || value === "total") {
      return value;
    }

    return "total" as WithdrawalCardTab;
  }, [params.tab]);
  const {
    loading,
    selectedWithdrawal,
    otherWithdrawals,
    totalWithdrawals,
    totalDepositedAmount,
    showAccountNumber,
    toast,
    actionWithdrawalId,
    actionStatus,
    setShowAccountNumber,
    approveWithdrawal,
    markWithdrawalPending,
  } = useAdminWithdrawalDetails(resolvedWithdrawalId);

  useEffect(() => {
    if (typeof resolvedWithdrawalId !== "undefined") {
      return;
    }

    Alert.alert("Withdrawal Error", "No withdrawal was selected.");
    router.back();
  }, [resolvedWithdrawalId]);

  useEffect(() => {
    if (loading || !resolvedWithdrawalId || selectedWithdrawal) {
      return;
    }

    Alert.alert("Withdrawal Error", "Unable to find this withdrawal.");
    router.back();
  }, [loading, resolvedWithdrawalId, selectedWithdrawal]);

  const displayName = getProfileDisplayName(selectedWithdrawal?.user.name);
  const avatarCharacter = displayName.charAt(0).toUpperCase() || "U";
  const currentTab =
    selectedWithdrawal?.status === "approved"
      ? "approved"
      : selectedWithdrawal?.status === "pending"
        ? "pending"
        : requestedTab;
  const accountNumberLabel = showAccountNumber
    ? selectedWithdrawal?.bankAccount?.accountNumber || "Bank details not provided"
    : maskAccountNumber(selectedWithdrawal?.bankAccount?.accountNumber);
  const isUpdatingMain = actionWithdrawalId === selectedWithdrawal?.id;

  const handleViewWithdrawal = (withdrawalId: string, tab: WithdrawalCardTab) => {
    router.replace(`/user-withdrawal?withdrawalId=${withdrawalId}&tab=${tab}` as Href);
  };

  const handleViewBank = () => {
    if (!selectedWithdrawal?.userId) {
      return;
    }

    router.push(`/user-bank-account?userId=${selectedWithdrawal.userId}` as Href);
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!selectedWithdrawal) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#E2E8F0" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>User Withdrawal</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.userCard}>
          <View style={styles.avatarLarge}>
            {selectedWithdrawal.user.avatar ? (
              <Image source={{ uri: selectedWithdrawal.user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{avatarCharacter}</Text>
            )}
          </View>

          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{selectedWithdrawal.user.email || "Not available"}</Text>
          <Text style={styles.userMeta}>
            {totalWithdrawals} Withdrawal{totalWithdrawals === 1 ? "" : "s"}
          </Text>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.amountBig}>
                ₹ {formatWithdrawalAmount(selectedWithdrawal.amount)}
              </Text>
              <Text style={styles.date}>
                {formatWithdrawalDate(selectedWithdrawal.createdAt)}
              </Text>
            </View>

            {currentTab !== "total" && (
              <View
                style={[
                  styles.badge,
                  currentTab === "approved" ? styles.approvedBadge : styles.pendingBadge,
                ]}
              >
                <Text style={styles.badgeText}>
                  {currentTab === "approved" ? "Approved" : "Pending"}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.block}>
            <Text style={styles.sectionTitle}>Bank Details</Text>

            <Text style={styles.label}>Bank</Text>
            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={14} color="#94A3B8" />
              <Text style={styles.detail}>
                {selectedWithdrawal.bankAccount?.bankName || "Bank details not provided"}
              </Text>
            </View>

            <Text style={styles.label}>Account Holder</Text>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={14} color="#94A3B8" />
              <Text style={styles.detail}>
                {selectedWithdrawal.bankAccount?.accountHolderName || "Not available"}
              </Text>
            </View>

            <Text style={styles.label}>Account Number</Text>
            <View style={styles.accountRow}>
              <Text style={styles.detail}>{accountNumberLabel}</Text>

              <TouchableOpacity
                onPress={() => setShowAccountNumber((current) => !current)}
                disabled={!selectedWithdrawal.bankAccount?.accountNumber}
              >
                <Ionicons
                  name={showAccountNumber ? "eye-off-outline" : "eye-outline"}
                  size={16}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>IFSC Code</Text>
            <View style={styles.detailRow}>
              <Ionicons name="git-branch-outline" size={14} color="#94A3B8" />
              <Text style={styles.detail}>
                {selectedWithdrawal.bankAccount?.ifscCode || "Not available"}
              </Text>
            </View>

            <Text style={styles.label}>Total Deposited Amount</Text>
            <View style={styles.detailRow}>
              <Ionicons name="wallet-outline" size={14} color="#94A3B8" />
              <Text style={styles.detail}>{formatCurrency(totalDepositedAmount)}</Text>
            </View>
          </View>

          <View style={styles.actionsWrap}>
            <View style={styles.actions}>
              {currentTab !== "approved" && (
                <TouchableOpacity
                  style={[
                    styles.approveBtn,
                    isUpdatingMain && actionStatus === "approved" && styles.disabledBtn,
                  ]}
                  disabled={isUpdatingMain}
                  onPress={() => void approveWithdrawal(selectedWithdrawal.id)}
                >
                  {isUpdatingMain && actionStatus === "approved" ? (
                    <ActivityIndicator size="small" color="#22C55E" />
                  ) : (
                    <Ionicons name="checkmark" size={14} color="#22C55E" />
                  )}
                  <Text style={styles.approveText}>Approve</Text>
                </TouchableOpacity>
              )}

              {currentTab !== "pending" && (
                <TouchableOpacity
                  style={[
                    styles.pendingBtn,
                    isUpdatingMain && actionStatus === "pending" && styles.disabledBtn,
                  ]}
                  disabled={isUpdatingMain}
                  onPress={() => void markWithdrawalPending(selectedWithdrawal.id)}
                >
                  {isUpdatingMain && actionStatus === "pending" ? (
                    <ActivityIndicator size="small" color="#FBBF24" />
                  ) : (
                    <Ionicons name="time-outline" size={14} color="#FBBF24" />
                  )}
                  <Text style={styles.pendingText}>Pending</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.viewBtn} onPress={handleViewBank}>
                <Ionicons name="eye-outline" size={14} color="#A5B4FC" />
                <Text style={styles.viewText}>View Bank</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {totalWithdrawals > 1 && otherWithdrawals.length > 0 && (
          <View style={styles.otherWrap}>
            <Text style={styles.otherTitle}>Other Withdrawals</Text>

            <View style={styles.otherList}>
              {otherWithdrawals.map((withdrawal) => (
                <WithdrawalRequestCard
                  key={withdrawal.id}
                  item={withdrawal}
                  tab={withdrawal.status === "approved" ? "approved" : "pending"}
                  actionWithdrawalId={actionWithdrawalId}
                  actionStatus={actionStatus}
                  onApprove={approveWithdrawal}
                  onPending={markWithdrawalPending}
                  onView={handleViewWithdrawal}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {toast !== "" && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
