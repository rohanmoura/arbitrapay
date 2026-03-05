import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { Href, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function AdminScreen() {
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
            <Text style={styles.title}>ADMIN PANEL</Text>
            <Text style={styles.subtitle}>
                Welcome Admin: {profile?.email}
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
        backgroundColor: "#111827",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#F59E0B",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#E5E7EB",
    },
});