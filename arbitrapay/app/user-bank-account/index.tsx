import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";

export default function UserBankAccountScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#020617",
        paddingHorizontal: 16,
        paddingTop: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#E2E8F0" />
        </TouchableOpacity>

        <Text style={{ color: "#F8FAFC", fontSize: 20, fontWeight: "700" }}>
          Bank Account Detail
        </Text>

        <View style={{ width: 22 }} />
      </View>

      <View
        style={{
          borderRadius: 18,
          borderWidth: 1,
          borderColor: "#1E293B",
          backgroundColor: "#020617",
          padding: 20,
        }}
      >
        <Text style={{ color: "#E2E8F0", fontSize: 16, fontWeight: "600" }}>
          Placeholder
        </Text>
        <Text style={{ color: "#94A3B8", fontSize: 13, marginTop: 8 }}>
          Bank account detail view for ID: {id || "Not available"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
