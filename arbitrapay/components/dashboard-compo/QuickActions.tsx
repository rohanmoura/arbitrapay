import { styles } from "@/screens/dashboard/QuickActions.styles";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function QuickLinks() {

  const actions: { title: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    {
      title: "Bank Accounts",
      icon: "card-outline"
    },
    {
      title: "Deposit",
      icon: "arrow-down-circle-outline"
    },
    {
      title: "Withdraw",
      icon: "arrow-up-circle-outline"
    },
    {
      title: "Transactions",
      icon: "time-outline"
    }
  ];

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Quick Actions</Text>

      <View style={styles.grid}>

        {actions.map((item, index) => (
          <TouchableOpacity key={index} style={styles.actionBtn}>

            <View style={styles.iconBox}>
              <Ionicons name={item.icon} size={22} color="#8B5CF6" />
            </View>

            <Text style={styles.label}>{item.title}</Text>

          </TouchableOpacity>
        ))}

      </View>

    </View>
  );
}