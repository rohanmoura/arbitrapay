import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#0B1220"
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },

    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#13182B",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700"
    },

    walletCard: {
        borderRadius: 24,
        padding: 22,
        marginBottom: 24,
        backgroundColor: "#151A2E",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)"
    },

    walletLabel: {
        color: "#7C8DB5",
        fontSize: 12,
        letterSpacing: 1
    },

    balanceBox: {
        marginTop: 8
    },

    balanceLabel: {
        color: "#6B7AA6",
        fontSize: 13
    },

    balanceAmount: {
        color: "#34D399",
        fontSize: 34,
        fontWeight: "800",
        marginTop: 4
    },

    walletMeta: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 18
    },

    metaLabel: {
        color: "#6B7280",
        fontSize: 11
    },

    metaValue: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
        marginTop: 2
    },

    card: {
        backgroundColor: "#12172A",
        borderRadius: 22,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)"
    },

    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600"
    },

    sectionDesc: {
        color: "#9CA3AF",
        fontSize: 13,
        marginBottom: 18
    },

    inputLabel: {
        color: "#fff",
        fontSize: 14,
        marginBottom: 8,
        marginTop: 10
    },

    input: {
        borderWidth: 1,
        borderColor: "#2B3553",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
        color: "#fff",
        marginBottom: 12,
        backgroundColor: "#0F1426",
        fontSize: 18,
        fontWeight: "600"
    },

    quickRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 10
    },

    quickBtn: {
        backgroundColor: "#1F2937",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#25304E"
    },

    quickBtnActive: {
        backgroundColor: "#1E293B",
        borderColor: "#5B6CFF"
    },

    quickText: {
        color: "#C7D2FE",
        fontWeight: "600"
    },

    quickTextActive: {
        color: "#8EA2FF"
    },

    limitText: {
        color: "#9CA3AF",
        fontSize: 12,
        marginBottom: 18
    },

    bankCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0F1426",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "#1E2746",
        marginBottom: 18
    },

    bankCardSelected: {
        borderColor: "#5B6CFF",
        backgroundColor: "#131A31"
    },

    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: "#5B6CFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14
    },

    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#5B6CFF"
    },

    bankIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#182038",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14
    },

    bankDetails: {
        flex: 1
    },

    bankName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700"
    },

    bankMeta: {
        color: "#94A3B8",
        fontSize: 13,
        marginTop: 4
    },

    bankTag: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: "rgba(251,191,36,0.14)",
        borderWidth: 1,
        borderColor: "rgba(251,191,36,0.22)"
    },

    bankTagText: {
        color: "#FBBF24",
        fontSize: 12,
        fontWeight: "700"
    },

    emptyBankBox: {
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#2D395C",
        borderRadius: 18,
        paddingVertical: 28,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "#0F1426",
        marginBottom: 18
    },

    emptyBankTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginTop: 14
    },

    emptyBankText: {
        color: "#94A3B8",
        fontSize: 13,
        textAlign: "center",
        lineHeight: 20,
        marginTop: 8,
        marginBottom: 18
    },

    addBankBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 14,
        paddingVertical: 14,
        backgroundColor: "#5B6CFF",
        paddingHorizontal: 18,
        minWidth: 180
    },

    addBankText: {
        color: "#fff",
        fontWeight: "700"
    },

    infoBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        backgroundColor: "#161E34",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#27314F"
    },

    infoIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(52,211,153,0.12)"
    },

    infoContent: {
        flex: 1
    },

    infoTitle: {
        color: "#D1FAE5",
        fontWeight: "700",
        marginBottom: 6
    },

    infoText: {
        color: "#9CA3AF",
        fontSize: 13,
        lineHeight: 20
    },

    submitBtn: {
        backgroundColor: "#10B981",
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 10
    },

    submitDisabled: {
        opacity: 0.4
    },

    submitText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700"
    },

    helperRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 14,
        marginBottom: 4
    },

    helperLabel: {
        color: "#6B7280",
        fontSize: 12
    },

    helperValue: {
        color: "#E5E7EB",
        fontSize: 12,
        fontWeight: "600"
    },

    toast: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: "#1F2937",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#2B3553"
    },

    toastText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "500"
    }
});
