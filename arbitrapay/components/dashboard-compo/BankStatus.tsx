import { styles } from "@/screens/dashboard/BankStats.styles";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function BankStats() {
  return (
    <View style={styles.container}>

      {/* BIG BANK CARD */}
      <View style={styles.bigCard}>

        <View style={styles.bigHeader}>
          <View style={styles.bankInfo}>
            <Ionicons name="business-outline" size={20} color="#F59E0B" />
            <Text style={styles.bigLabel}>Bank Accounts</Text>
          </View>

          <Text style={styles.bigValue}>0</Text>
        </View>

        {/* EMPTY STATE */}
        <Text style={styles.emptyText}>
          No bank accounts added yet
        </Text>

        <TouchableOpacity style={styles.addBtn} activeOpacity={0.85}>
          <Ionicons name="add-circle-outline" size={18} color="#fff" />
          <Text style={styles.addText}>Add Bank Account</Text>
        </TouchableOpacity>

      </View>


      {/* SECOND ROW */}
      <View style={styles.gridRow}>

        {/* VERIFIED BANKS */}
        <View style={styles.statCard}>

          <View style={styles.statLeft}>
            <View style={styles.iconBlue}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#3B82F6" />
            </View>

            <View>
              <Text style={styles.statLabel}>Verified Banks</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>

        </View>


        {/* WITHDRAWALS */}
        <View style={styles.statCard}>

          <Text style={styles.statLabel}>Pending Withdrawals</Text>

          <Text style={styles.statValue}>0.00</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressBar} />
          </View>

        </View>

      </View>

    </View>
  );
}