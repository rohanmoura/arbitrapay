import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#020617", // 🔥 deeper dark
    },

    scrollContainer: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 60,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28,
    },

    headerTitle: {
        color: "#F8FAFC",
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: 0.3,
    },

    // 🔥 HERO CARD (NOW WITH DEPTH)
    profileCard: {
        borderRadius: 20,
        paddingTop: 36,
        paddingBottom: 22,
        alignItems: "center",
        marginBottom: 18,

        backgroundColor: "#020617",
        borderWidth: 1,
        borderColor: "#1E293B",
    },

    avatar: {
        width: 78,
        height: 78,
        borderRadius: 39,
        backgroundColor: "#1E293B",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },

    avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: 39,
    },

    avatarText: {
        color: "#F8FAFC",
        fontSize: 28,
        fontWeight: "700",
    },

    name: {
        color: "#F8FAFC",
        fontSize: 22,
        fontWeight: "700",
    },

    email: {
        color: "#64748B",
        fontSize: 13,
        marginTop: 6,
    },

    statusRow: {
        flexDirection: "row",
        marginTop: 16,
        gap: 10,
    },

    activeBadge: {
        backgroundColor: "#16A34A20",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
    },

    inactiveBadge: {
        backgroundColor: "#EF444420",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
    },

    statusText: {
        color: "#E2E8F0",
        fontSize: 12,
        fontWeight: "600",
    },

    // 🔥 INFO CARD (GLASS FEEL)
    infoCard: {
        borderRadius: 18,
        padding: 16,
        marginBottom: 20,

        backgroundColor: "#020617",
        borderWidth: 1,
        borderColor: "#1E293B",
    },

    sectionTitle: {
        color: "#CBD5F5",
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 12,
        letterSpacing: 0.6,
    },

    infoText: {
        color: "#94A3B8",
        fontSize: 13,
        marginBottom: 8,
    },

    // 🔥 LIST CARD (THIS IS WHERE MAGIC HAPPENS)
    gridCard: {
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "#020617",
        borderWidth: 1,
        borderColor: "#1E293B",

        // 🔥 glow effect
        shadowColor: "#6366F1",
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: "#1E293B",
    },

    rowText: {
        color: "#E2E8F0",
        fontSize: 15,
        fontWeight: "600",
    },

    rowRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    rowValue: {
        color: "#818CF8", // 🔥 accent color (premium feel)
        fontSize: 13,
        fontWeight: "600",
    },

    successBadge: {
        backgroundColor: "#22C55E20",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
    },

    warningBadge: {
        backgroundColor: "#F59E0B20",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
    },

    suspendBtn: {
        marginTop: 18,
        backgroundColor: "#EF444420",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },

    suspendText: {
        color: "#EF4444",
        fontWeight: "600",
    },

    // 🔥 TOP BADGE
    topBadge: {
        position: "absolute",
        top: 16,
        left: 16,
        backgroundColor: "#052E2B", // darker green base
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },

    topBadgeText: {
        color: "#22C55E",
        fontSize: 11,
        fontWeight: "600",
    },

    topBadgeSuspended: {
        backgroundColor: "#450A0A",
    },

    topBadgeTextSuspended: {
        color: "#FCA5A5",
    },

    // 🔥 SUB STATUS TEXT
    subStatus: {
        marginTop: 6,
        color: "#F59E0B",
        fontSize: 13,
        fontWeight: "500",
    },

    subStatusWarning: {
        color: "#F59E0B",
    },

    // 🔥 ACTION ROW
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        width: "100%",
        gap: 12,
    },

    // 🔥 SECONDARY BTN
    secondaryBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#1E293B",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },

    secondaryText: {
        color: "#CBD5F5",
        fontWeight: "500",
    },

    // 🔥 PRIMARY BTN
    primaryBtn: {
        flex: 1,
        backgroundColor: "#EF4444",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },

    primaryText: {
        color: "#FFF",
        fontWeight: "600",
    },

    // 🔥 NEW BUTTON (small + premium)
    suspendBtnNew: {
        marginTop: 14,
        borderRadius: 8,

        backgroundColor: "#7F1D1D", // 🔥 muted red (not loud)
        paddingVertical: 6,
        paddingHorizontal: 14,
    },

    suspendTextNew: {
        color: "#FCA5A5",
        fontWeight: "600",
        fontSize: 12,
    },

    suspendBtnDisabled: {
        opacity: 0.6,
    },

    // 🔥 EMAIL ROW
    emailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 6,
    },

    // 🔥 STATUS + ACTION SAME ROW
    statusActionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: 14,
        paddingHorizontal: 14,
    },

    // 🔥 LEFT SIDE (ICON + TEXT)
    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

});
