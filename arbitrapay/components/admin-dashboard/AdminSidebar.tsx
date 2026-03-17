import { handleLogout } from "@/lib/logout";
import { styles } from "@/screens/dashboard/AdminSidebar.styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type AdminSection =
  | "dashboard"
  | "users"
  | "bank_accounts"
  | "deposits"
  | "withdrawals"
  | "live_deposits"
  | "support_tickets"
  | "updates"
  | "settings";

export type AdminSidebarItem = {
  key: AdminSection;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  items: AdminSidebarItem[];
};

export default function AdminSidebar({
  visible,
  onClose,
  activeSection,
  onSelectSection,
  items,
}: Props) {
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      await handleLogout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.drawer}>
          <View style={styles.header}>
            <View style={styles.brandBadge}>
              <Ionicons name="shield-half-outline" size={20} color="#F8FAFC" />
            </View>

            <View style={styles.headerText}>
              <Text style={styles.appName}>ArbitraPay Admin</Text>
              <Text style={styles.sub}>Control center</Text>
            </View>
          </View>

          <View style={styles.menu}>
            {items.map((item) => {
              const active = activeSection === item.key;

              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.item, active && styles.activeItem]}
                  activeOpacity={0.85}
                  onPress={() => {
                    onSelectSection(item.key);
                    onClose();
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={19}
                    color={active ? "#8B5CF6" : "#94A3B8"}
                  />
                  <Text style={[styles.label, active && styles.activeLabel]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.logoutBtn}
              activeOpacity={0.85}
              onPress={logout}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              )}
              <Text style={styles.logoutText}>
                {loggingOut ? "Logging out..." : "Logout"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
