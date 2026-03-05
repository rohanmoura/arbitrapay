import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";

export default function UserScreen() {
  const { profile } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Logout Error", error.message);
      return;
    }

    router.replace("/login" as Href);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>USER DASHBOARD</Text>

      <Text style={styles.subtitle}>
        Welcome: {profile?.email}
      </Text>

      <View style={{ marginTop: 30 }}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
  },
});