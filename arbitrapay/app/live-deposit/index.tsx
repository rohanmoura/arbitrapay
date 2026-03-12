import { styles } from "@/screens/feature-compo/LiveDeposit.style";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LiveDepositLocked() {

    const router = useRouter();

    return (

        <SafeAreaView style={styles.safeArea}>

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Live Deposits
                    </Text>

                </View>

                <Text style={styles.pageDesc}>
                    Real-time deposit tracking
                </Text>

                {/* STATUS BADGE */}

                <View style={styles.statusBadge}>
                    <Ionicons name="alert-circle-outline" size={14} color="#F59E0B" />
                    <Text style={styles.statusText}>
                        Activation Required
                    </Text>
                </View>


                {/* LOCK NOTICE */}

                <View style={styles.lockCard}>

                    <Ionicons
                        name="lock-closed-outline"
                        size={18}
                        color="#22C55E"
                    />

                    <Text style={styles.lockText}>
                        Deposits are locked until your account is activated.
                    </Text>

                </View>

                <View style={styles.activationCard}>

                    <View style={styles.iconCircle}>
                        <Ionicons name="sparkles-outline" size={28} color="#fff" />
                    </View>

                    <Text style={styles.activationTitle}>
                        Account Not Activated
                    </Text>

                    <Text style={styles.activationDesc}>
                        Submit activation request with your bank details
                        to start receiving live deposits
                    </Text>

                    <TouchableOpacity
                        style={styles.activateBtn}
                        onPress={() => router.push("/account-activation" as Href)}
                    >

                        <Text style={styles.activateText}>
                            Go to Account Activation
                        </Text>

                    </TouchableOpacity>

                </View>

                <View style={styles.infoCard}>

                    <Text style={styles.infoTitle}>
                        How to activate:
                    </Text>

                    <View style={styles.stepRow}>
                        <Text style={styles.stepNumber}>1.</Text>
                        <Text style={styles.stepText}>
                            Go to &quot;Account Activation&quot; page from sidebar
                        </Text>
                    </View>

                    <View style={styles.stepRow}>
                        <Text style={styles.stepNumber}>2.</Text>
                        <Text style={styles.stepText}>
                            Fill all your bank and card details
                        </Text>
                    </View>

                    <View style={styles.stepRow}>
                        <Text style={styles.stepNumber}>3.</Text>
                        <Text style={styles.stepText}>
                            Submit for admin approval
                        </Text>
                    </View>

                    <View style={styles.stepRow}>
                        <Text style={styles.stepNumber}>4.</Text>
                        <Text style={styles.stepText}>
                            Once approved, live deposits will start automatically
                        </Text>
                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>

    )

}