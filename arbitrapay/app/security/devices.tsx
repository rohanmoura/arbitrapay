import { styles } from "@/screens/security/Devices.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Devices() {

    const router = useRouter();

    return (

        <SafeAreaView style={styles.safe}>

            <View style={styles.container}>

                {/* HEADER */}

                <View style={styles.header}>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backBtn}
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Active Devices</Text>

                </View>


                {/* CURRENT DEVICE */}

                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>Current Device</Text>

                    <View style={styles.deviceRow}>
                        <Ionicons name="phone-portrait" size={20} color="#8B5CF6" />

                        <View style={{ flex: 1 }}>
                            <Text style={styles.deviceName}>Android Device</Text>
                            <Text style={styles.deviceInfo}>
                                Ghaziabad • This device
                            </Text>
                        </View>

                        <Text style={styles.active}>Active</Text>

                    </View>

                </View>


                {/* SECURITY ACTION */}

                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>Security</Text>

                    <TouchableOpacity style={styles.logoutRow}>
                        <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                        <Text style={styles.logoutText}>Logout Other Devices</Text>
                    </TouchableOpacity>

                </View>

            </View>

        </SafeAreaView>
    );
}