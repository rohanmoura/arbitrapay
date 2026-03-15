import AdminSidebar, {
  type AdminSection,
  type AdminSidebarItem,
} from "@/components/admin-dashboard/AdminSidebar";
import SecurityDepositSetupCard from "@/components/admin-dashboard/SecurityDepositSetupCard";
import { useAuth } from "@/contexts/AuthContext";
import { styles } from "@/screens/dashboard/AdminDashboard.styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ADMIN_SECTIONS: AdminSidebarItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "grid-outline" },
  { key: "users", label: "Users", icon: "people-outline" },
  { key: "deposits", label: "Deposits", icon: "wallet-outline" },
  { key: "withdrawals", label: "Withdrawals", icon: "arrow-down-circle-outline" },
  { key: "live_deposits", label: "Live Deposits", icon: "pulse-outline" },
  { key: "support_tickets", label: "Support Tickets", icon: "headset-outline" },
  { key: "updates", label: "Updates", icon: "megaphone-outline" },
  { key: "settings", label: "Settings", icon: "settings-outline" },
];

// const SECTION_COPY: Record<
//   AdminSection,
//   {
//     title: string;
//     subtitle: string;
//     icon: keyof typeof Ionicons.glyphMap;
//   }
// > = {
//   dashboard: {
//     title: "Admin Dashboard",
//     subtitle: "Monitor the system and jump into core admin workflows.",
//     icon: "grid-outline",
//   },
//   users: {
//     title: "Users",
//     subtitle: "User management tools will be added here next.",
//     icon: "people-outline",
//   },
//   deposits: {
//     title: "Deposits",
//     subtitle: "Review incoming deposit requests and manage approval flow.",
//     icon: "wallet-outline",
//   },
//   withdrawals: {
//     title: "Withdrawals",
//     subtitle: "Track and review withdrawal requests from the user panel.",
//     icon: "arrow-down-circle-outline",
//   },
//   live_deposits: {
//     title: "Live Deposits",
//     subtitle: "Manage live credit and debit entries for activated accounts.",
//     icon: "pulse-outline",
//   },
//   support_tickets: {
//     title: "Support Tickets",
//     subtitle: "Handle user issues and keep support response times tight.",
//     icon: "headset-outline",
//   },
//   updates: {
//     title: "Updates & Announcements",
//     subtitle: "Publish important updates that users will see in their app.",
//     icon: "megaphone-outline",
//   },
//   settings: {
//     title: "Settings",
//     subtitle: "Admin-level configuration and future system controls live here.",
//     icon: "settings-outline",
//   },
// };

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

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
