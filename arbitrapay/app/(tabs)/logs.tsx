import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Logs() {
    const { loading, profile } = useAuth();

    if (loading) {
        return null;
    }

    if (profile?.role !== "admin") {
        return <Redirect href="/(tabs)" />;
    }

    const smsForwardingEnabled = false;
    const logs = [];

    if (!smsForwardingEnabled || logs.length === 0) {
        return (
            <View style={styles.container}>

                <Ionicons
                    name="document-text-outline"
                    size={60}
                    color="#374151"
                />

                <Text style={styles.title}>No Logs Yet</Text>

                <Text style={styles.desc}>
                    Bank OTP and verification SMS logs will appear here once
                    SMS forwarding is enabled and matched messages are received.
                </Text>

                <Text style={styles.hint}>
                    Device onboarding and forwarding setup will unlock this admin log feed.
                </Text>

            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={{ color: "#fff" }}>Logs will appear here</Text>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#0B1220",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40
    },

    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8
    },

    desc: {
        color: "#9CA3AF",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20
    },

    hint: {
        color: "#6B7280",
        fontSize: 12,
        marginTop: 14,
        textAlign: "center"
    }

});
