import { styles } from "@/screens/dashboard/StatsGrid.styles";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  currentBalance: number;
  totalDeposits: number;
  pendingWithdrawals: number;
  totalUsdtSold: number;
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function StatsGrid({
  currentBalance,
  totalDeposits,
  pendingWithdrawals,
  totalUsdtSold,
}: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.row}>
        <View style={[styles.accent, { backgroundColor: "#3DDC97" }]} />
        <Ionicons name="wallet-outline" size={16} style={styles.icon} />
        <Text style={styles.label}>Wallet Total</Text>
        <Text style={styles.value}>{formatCurrency(currentBalance)}</Text>
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
        <Text style={[styles.value, styles.valueLocked]}>{formatCurrency(totalDeposits)}</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.accent, { backgroundColor: "#B084F5" }]} />
        <Ionicons name="time-outline" size={16} style={styles.icon} />
        <Text style={styles.label}>Pending Withdraw</Text>
        <Text style={[styles.value, styles.valuePending]}>{formatCurrency(pendingWithdrawals)}</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.accent, { backgroundColor: "#22D3EE" }]} />
        <Ionicons name="logo-bitcoin" size={16} style={styles.icon} />
        <Text style={styles.label}>Total USDT Sold</Text>
        <Text style={[styles.value, styles.valueUsdt]}>${formatCurrency(totalUsdtSold)}</Text>
      </View>

    </View>
  );
}
