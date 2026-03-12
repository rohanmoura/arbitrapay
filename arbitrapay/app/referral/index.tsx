import { styles } from "@/screens/feature-compo/Referral.style";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReferralScreen() {

    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const referralLink =
        "https://arbitrapay.app/ref=ABC123";

    return (

        <SafeAreaView style={styles.safeArea}>

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >

                {/* Header */}

                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Referral Program
                    </Text>

                </View>

                <Text style={styles.subtitle}>
                    Invite friends and earn rewards
                </Text>


                {/* Referral Card */}

                <View style={styles.referralCard}>

                    <View style={styles.cardHeader}>

                        <View style={styles.shareIcon}>
                            <Ionicons name="share-social-outline" size={18} color="#8B5CF6" />
                        </View>

                        <Text style={styles.cardTitle}>
                            Your Referral Link
                        </Text>

                    </View>

                    <Text style={styles.cardDesc}>
                        Share this link with friends to earn rewards
                    </Text>


                    {/* Link Box */}

                    <View style={styles.linkBox}>

                        <Text style={styles.linkText}>
                            {referralLink}
                        </Text>

                        <TouchableOpacity
                            style={styles.copyBtn}
                            onPress={() => {
                                setCopied(true)
                                setTimeout(() => setCopied(false), 1500)
                            }}
                        >
                            <Ionicons
                                name={copied ? "checkmark" : "copy-outline"}
                                size={18}
                                color="#A78BFA"
                            />
                        </TouchableOpacity>

                    </View>


                    {/* Rewards Info */}

                    <View style={styles.rewardBox}>

                        <Text style={styles.rewardText}>
                            🎁 Earn ₹100 when your referral makes their first deposit
                        </Text>

                        <Text style={styles.rewardText}>
                            🎉 Your friend gets ₹50 bonus on their first deposit
                        </Text>

                    </View>

                </View>


                {/* Stats */}

                <View style={styles.statsCard}>

                    <View style={styles.statItem}>

                        <View style={styles.statLeft}>

                            <View style={[styles.statIcon, { backgroundColor: "#2563EB" }]}>
                                <Ionicons name="people-outline" size={20} color="#fff" />
                            </View>

                            <Text style={styles.statLabel}>
                                Total Referrals
                            </Text>

                        </View>

                        <Text style={styles.statValue}>0</Text>

                    </View>


                    <View style={styles.statItem}>

                        <View style={styles.statLeft}>

                            <View style={[styles.statIcon, { backgroundColor: "#22C55E" }]}>
                                <Ionicons name="checkmark-outline" size={20} color="#fff" />
                            </View>

                            <Text style={styles.statLabel}>
                                Completed
                            </Text>

                        </View>

                        <Text style={styles.statValue}>0</Text>

                    </View>


                    <View style={styles.statItem}>

                        <View style={styles.statLeft}>

                            <View style={[styles.statIcon, { backgroundColor: "#EAB308" }]}>
                                <Ionicons name="time-outline" size={20} color="#fff" />
                            </View>

                            <Text style={styles.statLabel}>
                                Pending
                            </Text>

                        </View>

                        <Text style={styles.statValue}>0</Text>

                    </View>


                    <View style={styles.statItem}>

                        <View style={styles.statLeft}>

                            <View style={[styles.statIcon, { backgroundColor: "#8B5CF6" }]}>
                                <Ionicons name="gift-outline" size={20} color="#fff" />
                            </View>

                            <Text style={styles.statLabel}>
                                Total Earnings
                            </Text>

                        </View>

                        <Text style={styles.statValue}>
                            ₹0
                        </Text>

                    </View>

                </View>


                {/* Referrals List */}

                <View style={styles.referralsCard}>

                    <Text style={styles.referralsTitle}>
                        Your Referrals
                    </Text>

                    <Text style={styles.referralsSub}>
                        Track your referred users
                    </Text>

                    <View style={styles.emptyBox}>

                        <Ionicons
                            name="people-outline"
                            size={42}
                            color="#6B7280"
                        />

                        <Text style={styles.emptyTitle}>
                            No referrals yet
                        </Text>

                        <Text style={styles.emptyDesc}>
                            Share your referral link to get started
                        </Text>

                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>

    );

}