import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#020617",
    },

    container: {
        padding: 16,
    },

    // 🔥 USER CARD
    userCard: {
        backgroundColor: "#020617",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#1E293B",
    },

    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#4F46E5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },

    avatarImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },

    avatarText: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "700",
    },

    name: {
        color: "#F8FAFC",
        fontSize: 18,
        fontWeight: "700",
    },

    email: {
        color: "#64748B",
        fontSize: 13,
        marginTop: 4,
    },

    accountCount: {
        marginTop: 10,
        color: "#818CF8",
        fontSize: 13,
        fontWeight: "600",
    },

    sectionLabel: {
        color: "#94A3B8",
        fontSize: 13,
        marginBottom: 8,
        marginTop: 10,
    },

    // 🔥 PRIMARY CARD
    primaryCard: {
        backgroundColor: "#020617",
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#4F46E5",
    },

    // 🔥 NORMAL CARD
    card: {
        backgroundColor: "#020617",
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#1E293B",
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    bankName: {
        color: "#F8FAFC",
        fontWeight: "600",
    },

    primaryBadge: {
        backgroundColor: "#312E81",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },

    primaryText: {
        color: "#A5B4FC",
        fontSize: 11,
    },

    detail: {
        color: "#CBD5F5",
        fontSize: 12,
        marginTop: 4,
    },

    tagRow: {
        flexDirection: "row",
        marginTop: 10,
    },

    verifiedBadge: {
        backgroundColor: "#052E2B",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },

    verifiedText: {
        color: "#22C55E",
        fontSize: 11,
        fontWeight: "600",
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        alignItems: "center",
    },

    infoText: {
        color: "#94A3B8",
        fontSize: 12,
    },

    viewBtn: {
        backgroundColor: "#4F46E5",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },

    viewText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "600",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    headerTitle: {
        color: "#F8FAFC",
        fontSize: 18,
        fontWeight: "700",
    },

    // 🔥 GRID LAYOUT
    detailsGrid: {
        marginTop: 12,
        gap: 10,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#1E293B",
    },

    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    detailText: {
        color: "#CBD5F5",
        fontSize: 13,
        flex: 1,
    },

    // 🔥 TABS
    tabsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 14,
        gap: 10,
    },

    tab: {
        flex: 1,
        backgroundColor: "#020617",
        borderWidth: 1,
        borderColor: "#1E293B",
        borderRadius: 10,
        padding: 10,
    },

    tabLabel: {
        color: "#64748B",
        fontSize: 11,
    },

    actionRow: {
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#1E293B", // subtle divider
    },

    tabValue: {
        color: "#F8FAFC",
        fontSize: 14,
        fontWeight: "600",
        marginTop: 2,
    },

    emptyState: {
        backgroundColor: "#020617",
        borderRadius: 18,
        padding: 20,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#1E293B",
        alignItems: "center",
    },

    emptyStateText: {
        color: "#94A3B8",
        fontSize: 13,
    },
});
