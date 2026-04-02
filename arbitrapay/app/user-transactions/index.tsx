import FullScreenLoader from "@/components/FullScreenLoader";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import { styles } from "@/screens/feature-compo/PaymentHistory.style";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatAmount(amount: number) {
  return Number(amount).toLocaleString("en-IN");
}

function formatTransactionTime(timestamp: string | null) {
  if (!timestamp) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date(timestamp))
    .replace(",", " •");
}

function maskAccountNumber(accountNumber: string, visible: boolean) {
  if (!accountNumber) {
    return "******0000";
  }

  return visible ? accountNumber : `******${accountNumber.slice(-4)}`;
}

export default function UserTransactionsScreen() {
  const params = useLocalSearchParams<{ userId?: string | string[] }>();
  const userId = useMemo(
    () => (Array.isArray(params.userId) ? params.userId[0] : params.userId),
    [params.userId]
  );
  const {
    loading,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    summary,
    items,
    visibleTransactionId,
    setVisibleTransactionId,
  } = usePaymentHistory(userId);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Transactions</Text>
        </View>

        <Text style={styles.subtitle}>
          View all deposits and withdrawals for this user
        </Text>

        <View style={styles.summaryWrap}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <Text style={styles.summaryLabel}>Total Deposits</Text>
              <Ionicons name="arrow-down-circle-outline" size={20} color="#22C55E" />
            </View>
            <Text style={[styles.summaryValue, { color: "#22C55E" }]}>
              ₹{formatAmount(summary.totalDeposits)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <Text style={styles.summaryLabel}>Total Withdrawals</Text>
              <Ionicons name="arrow-up-circle-outline" size={20} color="#3B82F6" />
            </View>
            <Text style={[styles.summaryValue, { color: "#3B82F6" }]}>
              ₹{formatAmount(summary.totalWithdrawals)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Ionicons name="time-outline" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.summaryValue, { color: "#F59E0B" }]}>
              ₹{formatAmount(summary.pendingTransactions)}
            </Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Current Balance</Text>
              <Text style={styles.metricValue}>₹{formatAmount(summary.currentBalance)}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Pending Withdrawals</Text>
              <Text style={styles.metricValue}>₹{formatAmount(summary.pendingWithdrawals)}</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Total Bank Accounts</Text>
              <Text style={styles.metricValue}>{summary.totalBankAccounts}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Verified Bank Accounts</Text>
              <Text style={styles.metricValue}>{summary.verifiedBankAccounts}</Text>
            </View>
          </View>
        </View>

        <View style={styles.filterCard}>
          <View style={styles.tabs}>
            {["All", "Deposits", "Withdrawals"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setActiveTab(item as typeof activeTab)}
                style={[
                  styles.tabItem,
                  activeTab === item && styles.tabActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === item && styles.tabTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#64748B" />

            <TextInput
              placeholder="Search by Transaction ID"
              placeholderTextColor="#64748B"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="calendar-outline"
              size={60}
              color="#64748B"
            />

            <Text style={styles.emptyTitle}>No transactions yet</Text>

            <Text style={styles.emptyDesc}>
              This user&apos;s deposit and withdrawal history will appear here once activity starts.
            </Text>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {items.map((item) => {
              const visible = visibleTransactionId === item.id;
              const isDeposit = item.directionLabel === "Deposit";
              const amountColor = isDeposit ? "#22C55E" : "#EF4444";
              const statusColor =
                item.statusLabel === "Approved"
                  ? "#22C55E"
                  : item.statusLabel === "Pending"
                    ? "#F59E0B"
                    : "#EF4444";

              return (
                <View key={item.id} style={styles.transactionCard}>
                  <View style={styles.transactionIcon}>
                    <Ionicons
                      name={isDeposit ? "arrow-down-outline" : "arrow-up-outline"}
                      size={18}
                      color={amountColor}
                    />
                  </View>

                  <View style={styles.transactionBody}>
                    <View style={styles.transactionTop}>
                      <Text style={styles.transactionTitle}>{item.bankName}</Text>

                      <Text style={[styles.transactionAmount, { color: amountColor }]}>
                        {isDeposit ? "+" : "-"}₹{formatAmount(item.amount)}
                      </Text>
                    </View>

                    <View style={styles.transactionMetaRow}>
                      <Text style={styles.transactionMeta}>
                        A/C {maskAccountNumber(item.accountNumber, visible)}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          setVisibleTransactionId(visible ? null : item.id)
                        }
                      >
                        <Ionicons
                          name={visible ? "eye-off-outline" : "eye-outline"}
                          size={16}
                          color="#94A3B8"
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.transactionMeta}>IFSC {item.ifscCode}</Text>
                    <Text style={styles.transactionMeta}>Txn ID {item.transactionId}</Text>

                    <View style={styles.transactionBottom}>
                      <Text style={styles.transactionTime}>
                        {formatTransactionTime(item.createdAt)}
                      </Text>

                      <View style={styles.badgeRow}>
                        <Text
                          style={[
                            styles.directionBadge,
                            {
                              color: amountColor,
                              backgroundColor: isDeposit
                                ? "rgba(34,197,94,0.14)"
                                : "rgba(239,68,68,0.14)",
                            },
                          ]}
                        >
                          {item.directionLabel}
                        </Text>

                        <Text
                          style={[
                            styles.statusBadgeInline,
                            {
                              color: statusColor,
                              backgroundColor:
                                item.statusLabel === "Approved"
                                  ? "rgba(34,197,94,0.14)"
                                  : item.statusLabel === "Pending"
                                    ? "rgba(245,158,11,0.14)"
                                    : "rgba(239,68,68,0.14)",
                            },
                          ]}
                        >
                          {item.statusLabel}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
