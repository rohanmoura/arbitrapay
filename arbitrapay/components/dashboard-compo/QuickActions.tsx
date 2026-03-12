import { styles } from "@/screens/dashboard/QuickActions.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function QuickLinks() {

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
      route: "/transactions"
    }
  ];

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Quick Actions</Text>

      <View style={styles.grid}>

        {actions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionBtn}
            onPress={() => router.push(item.route as any)}
          >

            <View style={styles.iconBox}>
              <Ionicons name={item.icon as any} size={22} color="#8B5CF6" />
            </View>

            <Text style={styles.label}>{item.title}</Text>

          </TouchableOpacity>
        ))}

      </View>

    </View>
  );
}
