import { styles } from "@/screens/dashboard/OtherResources.styles";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function OtherResources() {

  const router = useRouter();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Other Resources</Text>

      <View style={styles.row}>

        {/* UPDATES */}
        <TouchableOpacity style={styles.card} activeOpacity={0.85}>

          <View style={[styles.iconBox, styles.blue]}>
            <Ionicons name="megaphone-outline" size={18} color="#4DA3FF" />
          </View>

          <Text style={styles.label}>Updates</Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>

        </TouchableOpacity>


        {/* REFERRALS */}
        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => router.push("/referral" as Href)}>

          <View style={[styles.iconBox, styles.green]}>
            <Ionicons name="people-outline" size={18} color="#3DDC97" />
          </View>

          <Text style={styles.label}>Referrals</Text>

        </TouchableOpacity>


        {/* AI ASSISTANT */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => router.push("/ai-assistant" as Href)}
        >
          <View style={[styles.iconBox, styles.purple]}>
            <Ionicons name="sparkles-outline" size={18} color="#B084F5" />
          </View>

          <Text style={styles.label}>AI Assistant</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}