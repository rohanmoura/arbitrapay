import AdminSidebar, {
  type AdminSection,
  type AdminSidebarItem,
} from "@/components/admin-dashboard/AdminSidebar";
import SecurityDepositSetupCard from "@/components/admin-dashboard/SecurityDepositSetupCard";
import UsersScreen from "@/components/admin-dashboard/UsersScreen";
import { useAuth } from "@/contexts/AuthContext";
import { styles } from "@/screens/dashboard/AdminDashboard.styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BankAccountsScreen from "../admin-dashboard/BankAccountScreen";
import SecurityDeposistsRequests from "../admin-dashboard/SecurityDepositsRequests";
import AccountActivationsScreen from "../admin-dashboard/AccountActivationsScreen";

const ADMIN_SECTIONS: AdminSidebarItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "grid-outline" },
  { key: "users", label: "Users", icon: "people-outline" },
  { key: "bank_accounts", label: "Bank Accounts", icon: "card-outline" },
  { key: "deposits", label: "Deposits", icon: "wallet-outline" },
  { key: "account_activations", label: "Account Activations", icon: "checkmark-circle-outline" },
  { key: "live_deposits", label: "Live Deposits", icon: "pulse-outline" },
  { key: "support_tickets", label: "Support Tickets", icon: "headset-outline" },
  { key: "updates", label: "Updates", icon: "megaphone-outline" },
  { key: "settings", label: "Settings", icon: "settings-outline" },
];

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

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

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>ArbitraPay Balance</Text>
            <Ionicons name="wallet-outline" size={20} color="#A78BFA" />
          </View>

          <Text style={styles.balanceAmount}>₹7,38,93,821</Text>

          <Text style={styles.balanceNote}>
            This is the total liquidity available for payouts and deposits.
          </Text>
        </View>

        <SecurityDepositSetupCard />
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
