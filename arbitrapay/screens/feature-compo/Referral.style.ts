import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: "#0B1220"
    },

    container: {
        padding: 20
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12
    },

    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#151A2E",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700"
    },

    subtitle: {
        color: "#94A3B8",
        marginBottom: 20
    },

    /* Referral Card */

    referralCard: {
        backgroundColor: "#151A2E",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#1E293B"
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        gap: 8
    },

    cardTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },

    cardDesc: {
        color: "#EDE9FE",
        marginBottom: 14
    },

    linkBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0F172A",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#1E293B"
    },

    linkText: {
        flex: 1,
        color: "#fff"
    },

    copyBtn: {
        padding: 8,
        backgroundColor: "#020617",
        borderRadius: 8
    },

    rewardBox: {
        backgroundColor: "#020617",
        borderRadius: 12,
        padding: 14,
        gap: 8,
        borderWidth: 1,
        borderColor: "#1E293B"
    },

    rewardText: {
        color: "#EDE9FE",
        fontSize: 13
    },

    /* Stats */

    statsCard: {
        backgroundColor: "#151A2E",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20
    },

    statItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12
    },

    statLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },

    statIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },

    statLabel: {
        color: "#E5E7EB"
    },

    statValue: {
        color: "#fff",
        fontWeight: "700"
    },

    /* Referrals */

    referralsCard: {
        backgroundColor: "#151A2E",
        borderRadius: 16,
        padding: 20
    },

    referralsTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },

    referralsSub: {
        color: "#9CA3AF",
        marginBottom: 18
    },

    emptyBox: {
        alignItems: "center",
        paddingVertical: 30
    },

    emptyTitle: {
        color: "#fff",
        marginTop: 8,
        fontWeight: "600"
    },

    emptyDesc: {
        color: "#9CA3AF",
        marginTop: 4
    },

    shareIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#1E293B",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10
    }

});