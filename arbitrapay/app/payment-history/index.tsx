import { styles } from "@/screens/feature-compo/PaymentHistory.style";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentHistory() {

    const router = useRouter();
    const [activeTab, setActiveTab] = useState("All");

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
                        Transactions
                    </Text>
                </View>

                <Text style={styles.subtitle}>
                    View all your deposits and withdrawals
                </Text>


                {/* Summary Cards */}

                <View style={styles.summaryWrap}>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryTop}>
                            <Text style={styles.summaryLabel}>Total Deposits</Text>
                            <Ionicons name="arrow-down-circle-outline" size={20} color="#22C55E" />
                        </View>
                        <Text style={[styles.summaryValue, { color: "#22C55E" }]}>0</Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryTop}>
                            <Text style={styles.summaryLabel}>Total Withdrawals</Text>
                            <Ionicons name="arrow-up-circle-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text style={[styles.summaryValue, { color: "#3B82F6" }]}>0</Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryTop}>
                            <Text style={styles.summaryLabel}>Pending</Text>
                            <Ionicons name="time-outline" size={20} color="#F59E0B" />
                        </View>
                        <Text style={[styles.summaryValue, { color: "#F59E0B" }]}>0</Text>
                    </View>

                </View>


                {/* Filter + Search */}

                <View style={styles.filterCard}>

                    <View style={styles.tabs}>

                        {["All", "Deposits", "Withdrawals"].map((item) => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => setActiveTab(item)}
                                style={[
                                    styles.tabItem,
                                    activeTab === item && styles.tabActive
                                ]}
                            >

                                <Text style={[
                                    styles.tabText,
                                    activeTab === item && styles.tabTextActive
                                ]}>
                                    {item}
                                </Text>

                            </TouchableOpacity>
                        ))}

                    </View>


                    <View style={styles.searchBox}>

                        <Ionicons name="search" size={18} color="#64748B" />

                        <TextInput
                            placeholder="Search by Transaction ID"
                            placeholderTextColor="#64748B"
                            style={styles.searchInput}
                        />

                    </View>

                </View>


                {/* Empty State */}

                <View style={styles.emptyCard}>

                    <Ionicons
                        name="calendar-outline"
                        size={60}
                        color="#64748B"
                    />

                    <Text style={styles.emptyTitle}>
                        No transactions yet
                    </Text>

                    <Text style={styles.emptyDesc}>
                        Your deposit and withdrawal history will appear here once you start using ArbitraPay
                    </Text>

                </View>

            </ScrollView>

        </SafeAreaView>

    );

}