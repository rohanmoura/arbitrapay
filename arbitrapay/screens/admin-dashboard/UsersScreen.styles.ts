import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#070B16",
        paddingHorizontal: 0
    },

    headerRow: {
        marginTop: 12,
        marginBottom: 14
    },

    title: {
        color: "#F8FAFC",
        fontSize: 24,
        fontWeight: "700"
    },

    count: {
        color: "#94A3B8",
        fontSize: 18
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 18
    },

    statCard: {
        flex: 1,
        backgroundColor: "#111827",
        padding: 12,
        borderRadius: 12,
        marginRight: 8
    },

    statNumber: {
        color: "#F8FAFC",
        fontSize: 18,
        fontWeight: "700"
    },

    statLabel: {
        color: "#94A3B8",
        fontSize: 11,
        marginTop: 2
    },

    controls: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 14
    },

    searchBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#111827",
        paddingHorizontal: 12,
        borderRadius: 12
    },

    input: {
        flex: 1,
        color: "#FFF",
        marginLeft: 6
    },

    sortBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#111827",
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 6
    },

    sortText: {
        color: "#E2E8F0"
    },

    searchBtn: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111827",
        paddingHorizontal: 12,
        borderRadius: 12,
        minWidth: 72
    },

    searchBtnText: {
        color: "#E2E8F0",
        fontSize: 13,
        fontWeight: "600"
    },

    dropdown: {
        backgroundColor: "#111827",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10
    },

    dropdownItem: {
        color: "#E2E8F0",
        paddingVertical: 6
    },

    list: {
        gap: 14
    },

    userCard: {
        backgroundColor: "#0F172A",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)"
    },

    userTopRow: {
        flexDirection: "row",
        alignItems: "center"
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#6366F1",
        alignItems: "center",
        justifyContent: "center"
    },

    avatarText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16
    },

    avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: 20
    },

    userInfo: {
        flex: 1,
        marginLeft: 10
    },

    name: {
        color: "#F8FAFC",
        fontWeight: "600",
        fontSize: 15
    },

    email: {
        color: "#94A3B8",
        fontSize: 12
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10
    },

    active: {
        backgroundColor: "rgba(34,197,94,0.25)"
    },

    suspended: {
        backgroundColor: "rgba(239,68,68,0.25)"
    },

    statusText: {
        color: "#FFF",
        fontSize: 12
    },

    detailsRow: {
        marginTop: 10,
        gap: 4
    },

    detail: {
        color: "#CBD5E1",
        fontSize: 12
    },

    bottomRow: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    activation: {
        color: "#94A3B8",
        fontSize: 12
    },

    actionRow: {
        flexDirection: "row",
        gap: 8
    },

    viewBtn: {
        backgroundColor: "#6366F1",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8
    },

    viewText: {
        color: "#FFF",
        fontSize: 12
    },

    suspendBtn: {
        backgroundColor: "rgba(239,68,68,0.25)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8
    },

    suspendText: {
        color: "#EF4444",
        fontSize: 12
    },

    suspendBtnDisabled: {
        opacity: 0.6
    },

    loadMoreBtn: {
        marginTop: 4,
        backgroundColor: "#111827",
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 6
    },

    loadMoreText: {
        color: "#F8FAFC",
        fontSize: 13,
        fontWeight: "600"
    },

    emptyState: {
        paddingVertical: 36,
        alignItems: "center"
    },

    emptyStateText: {
        color: "#94A3B8",
        fontSize: 14
    }

});
