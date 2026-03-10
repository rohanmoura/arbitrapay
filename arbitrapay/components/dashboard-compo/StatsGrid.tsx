import { styles } from "@/screens/dashboard/StatsGrid.styles";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function StatsGrid() {
  return (
    <View style={styles.container}>

      <View style={styles.row}>
        <View style={[styles.accent, { backgroundColor: "#3DDC97" }]} />
        <Ionicons name="wallet-outline" size={16} style={styles.icon} />
        <Text style={styles.label}>Wallet Total</Text>
        <Text style={styles.value}>0.00</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.accent, { backgroundColor: "#4DA3FF" }]} />
        <Ionicons name="people-outline" size={16} style={styles.icon} />
        <Text style={styles.label}>Referral Earnings</Text>
        <Text style={[styles.value, styles.valueReferral]}>0.00</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.accent, { backgroundColor: "#FF6B6B" }]} />
        <Ionicons name="lock-closed-outline" size={16} style={styles.icon} />
        <Text style={styles.label}>Locked Funds</Text>
        <Text style={[styles.value, styles.valueLocked]}>0.00</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.accent, { backgroundColor: "#B084F5" }]} />
        <Ionicons name="time-outline" size={16} style={styles.icon} />
        <Text style={styles.label}>Pending Withdraw</Text>
        <Text style={[styles.value, styles.valuePending]}>0</Text>
      </View>

    </View>
  );
}