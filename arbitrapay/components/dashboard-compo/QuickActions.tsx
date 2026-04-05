import { styles } from "@/screens/dashboard/QuickActions.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  totalUsdtSold: number;
};

function formatUsdt(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function QuickLinks({ totalUsdtSold }: Props) {

  const router = useRouter();

  const actions = [
    {
      title: "Bank Accounts",
      icon: "card-outline",
      route: "/bank-account"
    },
    {
      title: "Deposit",
      icon: "arrow-down-circle-outline",
      route: "/security-deposit"
    },
    {
      title: "Withdraw",
      icon: "arrow-up-circle-outline",
      route: "/withdrawal"
    },
    {
      title: "Transactions",
      icon: "time-outline",
      route: "/payment-history"
    },
    {
      title: "Sell USDT",
      icon: "logo-bitcoin",
      route: "/usdt-sell",
      fullWidth: true
    },
    {
      title: "Total USDT Sold",
      value: `$${formatUsdt(totalUsdtSold)}`,
      icon: "bar-chart-outline",
      route: "/usdt-sell",
      fullWidth: true,
      metric: true,
    },
  ];

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Quick Actions</Text>

      <View style={styles.grid}>

        {actions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionBtn,
              item.fullWidth && styles.actionBtnWide,
              item.metric && styles.metricBtn,
            ]}
            onPress={() => router.push(item.route as any)}
          >

            <View style={styles.iconBox}>
              <Ionicons name={item.icon as any} size={22} color={item.metric ? "#22D3EE" : "#8B5CF6"} />
            </View>

            <Text style={styles.label}>{item.title}</Text>
            {item.value ? <Text style={styles.metricValue}>{item.value}</Text> : null}

          </TouchableOpacity>
        ))}

      </View>

    </View>
  );
}
