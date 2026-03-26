import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020617", // 🔥 deeper black (premium feel)
        paddingHorizontal: 0,
    },

    title: {
        color: "#F8FAFC",
        fontSize: 26,
        fontWeight: "700",
        letterSpacing: 0.3,
    },

    count: {
        color: "#64748B",
        fontSize: 18,
    },

    // 🔥 STATS
    statsRow: {
        flexDirection: "row",
        gap: 12,
        marginVertical: 18,
    },

    statCard: {
        flex: 1,
        backgroundColor: "#020617",
        padding: 14,
        borderRadius: 14,

        borderWidth: 1,
        borderColor: "#1E293B",
    },

    statNumber: {
        color: "#F8FAFC",
        fontSize: 20,
        fontWeight: "700",
    },

    statLabel: {
        color: "#64748B",
        fontSize: 11,
        marginTop: 2,
    },

    // 🔥 CONTROLS
    controls: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },

    searchBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#020617",
        paddingHorizontal: 12,
        borderRadius: 12,

        borderWidth: 1,
        borderColor: "#1E293B",
    },

    input: {
        flex: 1,
        color: "#E2E8F0",
        marginLeft: 6,
        fontSize: 13,
    },

    searchBtn: {
        backgroundColor: "#111827",
        paddingHorizontal: 14,
        justifyContent: "center",
        borderRadius: 12,

        borderWidth: 1,
        borderColor: "#1E293B",
    },

    searchBtnText: {
        color: "#CBD5F5",
        fontSize: 12,
        fontWeight: "600",
    },

    sortBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#111827",
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 6,

        borderWidth: 1,
        borderColor: "#1E293B",
    },

    sortText: {
        color: "#CBD5F5",
        fontSize: 12,
    },

    // 🔥 LIST
    list: {
        gap: 14,
    },

    // 🔥 CARD (MAIN PREMIUM UPGRADE)
    card: {
        backgroundColor: "#020617",
        borderRadius: 20,
        padding: 16,

        borderWidth: 1,
        borderColor: "#1E293B",

        // subtle depth
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },

    // 🔥 TOP
    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#4F46E5", // 🔥 better indigo
        justifyContent: "center",
        alignItems: "center",
    },

    avatarText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 15,
    },

    avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: 21,
    },

    info: {
        flex: 1,
        marginLeft: 12,
    },

    name: {
        color: "#F8FAFC",
        fontWeight: "600",
        fontSize: 14,
    },

    email: {
        color: "#64748B",
        fontSize: 12,
        marginTop: 2,
    },

    // 🔥 BADGE (CLEANER)
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },

    active: {
        backgroundColor: "#052E2B",
    },

    suspended: {
        backgroundColor: "#3F1D1D",
    },

    badgeText: {
        color: "#E2E8F0",
        fontSize: 11,
        fontWeight: "600",
    },

    // 🔥 DETAILS (BETTER SEPARATION)
    details: {
        marginTop: 12,
        gap: 8,
        paddingTop: 12,

        borderTopWidth: 1,
        borderTopColor: "#1E293B",
    },

    detail: {
        color: "#94A3B8",
        fontSize: 12,
    },

    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    accountRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    // 🔥 BOTTOM
    bottomRow: {
        marginTop: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    activation: {
        color: "#64748B",
        fontSize: 12,
    },

    viewBtn: {
        backgroundColor: "#4F46E5",
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 10,
    },

    viewText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "600",
    },

    dropdown: {
        backgroundColor: "#111827",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#1E293B",
    },

    dropdownItem: {
        color: "#E2E8F0",
        paddingVertical: 6,
    },

    loadMoreBtn: {
        marginTop: 4,
        backgroundColor: "#111827",
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 6,
        borderWidth: 1,
        borderColor: "#1E293B",
    },

    loadMoreText: {
        color: "#F8FAFC",
        fontSize: 13,
        fontWeight: "600",
    },

    emptyState: {
        paddingVertical: 36,
        alignItems: "center",
    },

    emptyStateText: {
        color: "#94A3B8",
        fontSize: 14,
    },
});
