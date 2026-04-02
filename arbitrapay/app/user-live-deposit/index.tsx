import FullScreenLoader from "@/components/FullScreenLoader";
import { getProfileDisplayName } from "@/services/profileService";
import { useAdminLiveDepositDetails } from "@/hooks/useAdminLiveDepositDetails";
import { styles } from "@/screens/admin-dashboard/UserLiveDeposit.styles";
import { Ionicons } from "@expo/vector-icons";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function maskAccountNumber(accountNumber: string, visible: boolean) {
  if (visible) {
    return accountNumber;
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

export default function UserLiveDepositScreen() {
  const params = useLocalSearchParams<{
    requestId?: string | string[];
    userId?: string | string[];
  }>();
  const resolvedRequestId = useMemo(
    () => (Array.isArray(params.requestId) ? params.requestId[0] : params.requestId),
    [params.requestId]
  );
  const resolvedUserId = useMemo(
    () => (Array.isArray(params.userId) ? params.userId[0] : params.userId),
    [params.userId]
  );
  const {
    loading,
    sending,
    details,
    history,
    transactionType,
    amountInput,
    showAccountNumber,
    toast,
    setTransactionType,
    setAmountInput,
    setShowAccountNumber,
    submitDeposit,
  } = useAdminLiveDepositDetails(resolvedRequestId, resolvedUserId);

  useEffect(() => {
    if (typeof resolvedRequestId !== "undefined" || typeof resolvedUserId !== "undefined") {
      return;
    }

    Alert.alert("Live Deposit Error", "No live deposit request was selected.");
    router.back();
  }, [resolvedRequestId, resolvedUserId]);

  useEffect(() => {
    if (loading || details || resolvedRequestId || resolvedUserId) {
      return;
    }
  }, [details, loading, resolvedRequestId, resolvedUserId]);

  const displayName = getProfileDisplayName(details?.user.name);
  const avatarCharacter = displayName.charAt(0).toUpperCase() || "U";

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!details) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#E2E8F0" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Send Live Deposit</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.sectionTitle}>No approved live deposit route</Text>
          <Text style={styles.sectionSubtitle}>
            This user does not have an approved activation ready for live deposits yet.
          </Text>
        </View>
      </SafeAreaView>
    );
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

          <Text style={styles.headerTitle}>Send Live Deposit</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.userCard}>
          <View style={styles.userTopRow}>
            <View style={styles.avatar}>
              {details.user.avatar ? (
                <Image source={{ uri: details.user.avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{avatarCharacter}</Text>
              )}
            </View>

            <View style={styles.userMeta}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>{details.user.email || "Not available"}</Text>
            </View>
          </View>

          <View style={styles.totalDepositCard}>
            <Text style={styles.sectionLabel}>Total Security Deposit</Text>
            <Text style={styles.totalDepositAmount}>
              {formatCurrency(details.totalSecurityDepositAmount)}
            </Text>
            <Text style={styles.totalDepositHint}>
              Includes all security deposits across this user&apos;s accounts.
            </Text>
          </View>
        </View>

        <View style={styles.bankCard}>
          <View style={styles.bankTopRow}>
            <View style={styles.bankTitleWrap}>
              <Text style={styles.bankTitle}>
                {details.bankAccount.bankName || "Bank details not provided"}
              </Text>
              <Text style={styles.bankSubtitle}>
                Approved on {formatDateTime(details.activation.createdAt)}
              </Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>Approved</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailGrid}>
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Account Holder Name</Text>
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={15} color="#94A3B8" />
                <Text style={styles.detailText}>
                  {details.bankAccount.accountHolderName || displayName}
                </Text>
              </View>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Bank Name</Text>
              <View style={styles.detailRow}>
                <Ionicons name="business-outline" size={15} color="#94A3B8" />
                <Text style={styles.detailText}>
                  {details.bankAccount.bankName || "Not available"}
                </Text>
              </View>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Account Number</Text>
              <View style={styles.detailRow}>
                <Ionicons name="card-outline" size={15} color="#94A3B8" />
                <Text style={styles.detailText}>
                  {maskAccountNumber(details.bankAccount.accountNumber, showAccountNumber)}
                </Text>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => setShowAccountNumber((current) => !current)}
                >
                  <Ionicons
                    name={showAccountNumber ? "eye-off-outline" : "eye-outline"}
                    size={16}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>IFSC Code</Text>
              <View style={styles.detailRow}>
                <Ionicons name="git-branch-outline" size={15} color="#94A3B8" />
                <Text style={styles.detailText}>{details.bankAccount.ifscCode}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() =>
              router.push(
                `/user-account-activations?requestId=${details.requestId}` as Href
              )
            }
          >
            <Ionicons name="eye-outline" size={14} color="#CBD5F5" />
            <Text style={styles.secondaryBtnText}>See Bank Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Live Deposit Form</Text>
          <Text style={styles.sectionSubtitle}>
            Choose a transaction type and enter the amount to send.
          </Text>

          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[
                styles.typeChip,
                transactionType === "credit" && styles.typeChipActive,
              ]}
              onPress={() => setTransactionType("credit")}
            >
              <Text
                style={[
                  styles.typeChipText,
                  transactionType === "credit" && styles.typeChipTextActive,
                ]}
              >
                Credit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeChip,
                transactionType === "debit" && styles.typeChipActive,
              ]}
              onPress={() => setTransactionType("debit")}
            >
              <Text
                style={[
                  styles.typeChipText,
                  transactionType === "debit" && styles.typeChipTextActive,
                ]}
              >
                Debit
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            value={amountInput}
            onChangeText={setAmountInput}
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.sendBtn, sending && styles.sendBtnDisabled]}
            disabled={sending}
            onPress={() => void submitDeposit()}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="paper-plane-outline" size={16} color="#FFF" />
            )}
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.sectionTitle}>Live Deposit History</Text>
          <Text style={styles.sectionSubtitle}>
            Latest transactions for this approved bank account.
          </Text>

          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No live deposit history found for this account yet.
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {history.map((item) => {
                const isCredit = item.type === "credit";
                const accent = isCredit ? "#22C55E" : "#EF4444";

                return (
                  <View key={item.id} style={styles.historyItem}>
                    <View style={styles.historyIcon}>
                      <Ionicons
                        name={isCredit ? "arrow-down-outline" : "arrow-up-outline"}
                        size={18}
                        color={accent}
                      />
                    </View>

                    <View style={styles.historyBody}>
                      <View style={styles.historyTopRow}>
                        <Text style={[styles.historyAmount, { color: accent }]}>
                          {isCredit ? "+" : "-"}
                          {formatCurrency(item.amount)}
                        </Text>

                        <Text
                          style={[
                            styles.historyType,
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
                      </View>

                      <Text style={styles.historyMeta}>
                        {formatDateTime(item.createdAt)}
                      </Text>
                      <Text style={styles.historyStatus}>
                        Status: {item.status || "Not available"}
                      </Text>
                      {item.description ? (
                        <Text style={styles.historyMeta}>{item.description}</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
