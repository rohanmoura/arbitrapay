import AdminSidebar, {
  type AdminSection,
  type AdminSidebarItem,
} from "@/components/admin-dashboard/AdminSidebar";
import AdminTelegramSettingsCard from "@/components/admin-dashboard/AdminTelegramSettingsCard";
import SecurityDepositSetupCard from "@/components/admin-dashboard/SecurityDepositSetupCard";
import SupportTicketsScreen from "@/components/admin-dashboard/support-tickets";
import UsdtSellSetupCard from "@/components/admin-dashboard/UsdtSellSetupCard";
import UsdtSellRequests from "@/components/admin-dashboard/UsdtSellRequests";
import AdminUpdatesScreen from "@/components/admin-dashboard/updates";
import UsersScreen from "@/components/admin-dashboard/UsersScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { styles } from "@/screens/dashboard/AdminDashboard.styles";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountActivationsScreen from "../admin-dashboard/AccountActivationsScreen";
import BankAccountsScreen from "../admin-dashboard/BankAccountScreen";
import LiveDepositScreen from "../admin-dashboard/LiveDepositScreen";
import SecurityDeposistsRequests from "../admin-dashboard/SecurityDepositsRequests";
import WithdrawalsRequests from "../admin-dashboard/WithdrawalsRequests";

const ADMIN_SECTIONS: AdminSidebarItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "grid-outline" },
  { key: "users", label: "Users", icon: "people-outline" },
  { key: "bank_accounts", label: "Bank Accounts", icon: "card-outline" },
  { key: "deposits", label: "Deposits", icon: "wallet-outline" },
  { key: "usdt", label: "USDT", icon: "logo-bitcoin" },
  { key: "account_activations", label: "Account Activations", icon: "checkmark-circle-outline" },
  { key: "live_deposits", label: "Live Deposits", icon: "pulse-outline" },
  { key: "withdrawals", label: "Withdrawals", icon: "arrow-down-outline" },
  { key: "support_tickets", label: "Support Tickets", icon: "headset-outline" },
  { key: "updates", label: "Updates", icon: "megaphone-outline" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { dashboard, loading, savingBalance, saveBalance } = useAdminDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [editingBalance, setEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState("");

  useEffect(() => {
    if (editingBalance) {
      return;
    }

    setBalanceInput(String(dashboard.balance.defaultBalance));
  }, [dashboard.balance.defaultBalance, editingBalance]);

  const balanceCards = useMemo(
    () => [
      {
        key: "total_users",
        label: "Total Users",
        value: formatCount(dashboard.insights.totalUsers),
        icon: "people-outline" as const,
      },
      {
        key: "total_bank_accounts",
        label: "Total Bank Accounts",
        value: formatCount(dashboard.insights.totalBankAccounts),
        icon: "card-outline" as const,
      },
      {
        key: "total_activation_requests",
        label: "Activation Requests",
        value: formatCount(dashboard.insights.totalActivationRequests),
        icon: "checkmark-circle-outline" as const,
      },
      {
        key: "users_with_live_deposits",
        label: "Users with Live Deposits",
        value: formatCount(dashboard.insights.usersWithLiveDeposits),
        icon: "pulse-outline" as const,
      },
      {
        key: "total_security_deposits",
        label: "Security Deposits",
        value: formatCount(dashboard.insights.totalSecurityDeposits),
        icon: "wallet-outline" as const,
      },
      {
        key: "total_withdrawal_requests",
        label: "Withdrawal Requests",
        value: formatCount(dashboard.insights.totalWithdrawalRequests),
        icon: "arrow-down-outline" as const,
      },
    ],
    [dashboard.insights]
  );

  const handleStartBalanceEdit = () => {
    setBalanceInput(String(dashboard.balance.defaultBalance));
    setEditingBalance(true);
  };

  const handleCancelBalanceEdit = () => {
    setBalanceInput(String(dashboard.balance.defaultBalance));
    setEditingBalance(false);
  };

  const handleSaveBalance = async () => {
    const nextValue = Number(balanceInput.replace(/,/g, "").trim());

    if (!Number.isFinite(nextValue) || nextValue < 0) {
      return;
    }

    const saved = await saveBalance(nextValue);

    if (saved) {
      setEditingBalance(false);
    }
  };

  const renderMainContent = () => {
    if (activeSection === "users") {
      return <UsersScreen />;
    }
    if (activeSection === "bank_accounts") {
      return <BankAccountsScreen />;
    }
    if (activeSection === "deposits") {
      return <SecurityDeposistsRequests />;
    }
    if (activeSection === "account_activations") {
      return <AccountActivationsScreen />;
    }
    if (activeSection === "usdt") {
      return <UsdtSellRequests />;
    }
    if (activeSection === "live_deposits") {
      return <LiveDepositScreen />;
    }
    if (activeSection === "withdrawals") {
      return <WithdrawalsRequests />;
    }
    if (activeSection === "support_tickets") {
      return <SupportTicketsScreen />;
    }
    if (activeSection === "updates") {
      return <AdminUpdatesScreen />;
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceTitleWrap}>
              <Text style={styles.balanceLabel}>ArbitraPay Balance</Text>
              {/* <Text style={styles.balanceSubLabel}>Default balance plus live approved flows</Text> */}
            </View>

            <View style={styles.balanceActions}>
              {editingBalance ? (
                <>
                  <TouchableOpacity
                    style={styles.balanceIconButton}
                    activeOpacity={0.85}
                    onPress={handleSaveBalance}
                    disabled={savingBalance}
                  >
                    {savingBalance ? (
                      <ActivityIndicator size="small" color="#22C55E" />
                    ) : (
                      <Ionicons name="checkmark-outline" size={18} color="#22C55E" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.balanceIconButton}
                    activeOpacity={0.85}
                    onPress={handleCancelBalanceEdit}
                    disabled={savingBalance}
                  >
                    <Ionicons name="close-outline" size={18} color="#F87171" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.balanceIconButton}
                  activeOpacity={0.85}
                  onPress={handleStartBalanceEdit}
                  disabled={loading}
                >
                  <Ionicons name="wallet-outline" size={20} color="#A78BFA" />
                </TouchableOpacity>
              )}

            </View>
          </View>

          {editingBalance ? (
            <TextInput
              value={balanceInput}
              onChangeText={(text) => setBalanceInput(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              placeholder="Enter default balance"
              placeholderTextColor="#475569"
              style={styles.balanceInput}
              editable={!savingBalance}
            />
          ) : (
            <Text style={styles.balanceAmount}>
              {formatCurrency(dashboard.balance.currentBalance)}
            </Text>
          )}

          {/* <Text style={styles.balanceNote}>
            Default {formatCurrency(dashboard.balance.defaultBalance)} + deposits{" "}
            {formatCurrency(dashboard.balance.approvedSecurityDeposits)} - withdrawals{" "}
            {formatCurrency(dashboard.balance.approvedWithdrawals)} - live credit{" "}
            {formatCurrency(dashboard.balance.liveDepositCredit)} + live debit{" "}
            {formatCurrency(dashboard.balance.liveDepositDebit)}
          </Text> */}
        </View>

        <View style={styles.statsGrid}>
          {balanceCards.map((card) => (
            <View key={card.key} style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Ionicons name={card.icon} size={18} color="#A78BFA" />
              </View>
              <Text style={styles.statLabel}>{card.label}</Text>
              <Text style={styles.statValue}>{card.value}</Text>
            </View>
          ))}
        </View>

        <SecurityDepositSetupCard />
        <AdminTelegramSettingsCard />
        <UsdtSellSetupCard />

        <TouchableOpacity
          style={styles.historyButton}
          activeOpacity={0.85}
          onPress={() => router.push("/user-live-deposit-history" as Href)}
        >
          <View style={styles.historyButtonIcon}>
            <Ionicons name="time-outline" size={18} color="#CBD5F5" />
          </View>
          <Text style={styles.historyButtonText}>Live Deposit History</Text>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.85}
            onPress={() => setSidebarOpen(true)}
          >
            <Ionicons name="menu" size={22} color="#F8FAFC" />
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.headerSubtitle}>
              {profile?.email || "Administrator"}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>ADMIN</Text>
            </View>
          </View>
        </View>

        {renderMainContent()}

        <AdminSidebar
          visible={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          items={ADMIN_SECTIONS}
        />
      </View>
    </SafeAreaView>
  );
}
