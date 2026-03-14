import { handleLogout } from "@/lib/logout";
import { styles } from "@/screens/security/Security.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Security() {

    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const logoutForAnotherAccount = async () => {
        if (loggingOut) {
            return;
        }

        setLoggingOut(true);

        try {
            await handleLogout();

        } finally {
            setLoggingOut(false);
        }
    };

    return (

        <SafeAreaView style={styles.safe}>

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.container}>

                    {/* HEADER */}

                    <View style={styles.header}>

                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backBtn}
                        >
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>

                        <Text style={styles.title}>Security</Text>

                    </View>


                    {/* SECURITY STATUS */}

                    <View style={styles.securityCard}>

                        <Ionicons name="shield-checkmark" size={22} color="#22C55E" />

                        <View style={{ flex: 1 }}>
                            <Text style={styles.securityTitle}>Account Protected</Text>
                            <Text style={styles.securitySub}>
                                Google authentication and Gmail verification enabled
                            </Text>
                        </View>

                    </View>


                    {/* LOGIN METHODS */}

                    <View style={styles.card}>

                        <Text style={styles.sectionTitle}>Login Methods</Text>

                        <View style={styles.row}>
                            <Ionicons name="logo-google" size={18} color="#8B5CF6" />
                            <Text style={styles.rowText}>Google Account</Text>
                            <Text style={styles.status}>Active</Text>
                        </View>

                        <View style={styles.row}>
                            <Ionicons name="mail-open-outline" size={18} color="#8B5CF6" />
                            <Text style={styles.rowText}>Gmail Verification</Text>
                            <Text style={styles.status}>Verified</Text>
                        </View>

                        {/* ADD ACCOUNT */}

                        <TouchableOpacity
                            style={[styles.addBtn, loggingOut && styles.disabledButton]}
                            onPress={logoutForAnotherAccount}
                            disabled={loggingOut}
                        >
                            <Ionicons name="add-circle-outline" size={18} color="#8B5CF6" />
                            {loggingOut ? (
                                <ActivityIndicator size="small" color="#8B5CF6" />
                            ) : (
                                <Text style={styles.addText}>Add Another Account</Text>
                            )}
                        </TouchableOpacity>

                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>

    );
}
