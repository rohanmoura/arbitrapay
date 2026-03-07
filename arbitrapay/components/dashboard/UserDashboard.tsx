import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function UserScreen() {
  const { profile, session } = useAuth();

  async function handleLogout() {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();

      if (currentUser) {
        await GoogleSignin.signOut();
      }

      // Supabase logout
      const { error } = await supabase.auth.signOut();

      if (error) {
        Alert.alert("Logout Error", error.message);
        return;
      }

    } catch (err: any) {
      Alert.alert("Logout Error", err.message);
    }
  }

  const email = profile?.email ?? session?.user?.email ?? "User";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>USER DASHBOARD</Text>

      <Text style={styles.subtitle}>
        Welcome: {email}
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