import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

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
        color: "#7C9CFF",
        fontSize: 34,
        fontWeight: "800",
        marginTop: 4
    },

    telegramBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 14,
        paddingVertical: 14,
        marginBottom: 26,
        borderWidth: 1,
        borderColor: "#2B3553",
        backgroundColor: "#13182B"
    },

    telegramText: {
        color: "#8EA2FF",
        fontWeight: "600"
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
        marginBottom: 14
    },

    /* PAYMENT METHOD */

    methodRow: {
        flexDirection: "row",
        backgroundColor: "#0F1426",
        borderRadius: 14,
        padding: 4,
        marginTop: 12
    },

    methodBtn: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        paddingVertical: 10,
        borderRadius: 10
    },

    activeMethod: {
        backgroundColor: "#5B6CFF"
    },

    methodText: {
        color: "#fff",
        fontWeight: "600"
    },

    /* UPI */

    upiBox: {
        marginTop: 18,
        borderRadius: 14,
        padding: 16,
        backgroundColor: "#0F1426"
    },

    upiLabel: {
        color: "#9CA3AF",
        fontSize: 12
    },

    upiRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 4
    },

    upiId: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600"
    },

    copyBtn: {
        padding: 6
    },

    /* BANK DETAILS */

    bankBox: {
        marginTop: 18,
        backgroundColor: "#0F1426",
        borderRadius: 14,
        padding: 16
    },

    bankLabel: {
        color: "#6B7280",
        fontSize: 12,
        marginTop: 8
    },

    bankValue: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        marginTop: 2
    },

    /* COMMISSION */

    commissionTitle: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 10
    },

    commissionBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
    },

    accountCard: {
        flex: 1,
        backgroundColor: "#0F1426",
        borderRadius: 16,
        padding: 14,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#1E2746"
    },

    accountTitle: {
        color: "#9AA4C7",
        fontSize: 12
    },

    accountPercent: {
        color: "#7C9CFF",
        fontSize: 18,
        fontWeight: "700",
        marginTop: 4
    },

    accountMin: {
        color: "#6B7280",
        fontSize: 11,
        marginTop: 2
    },

    /* INPUT */

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
        backgroundColor: "#0F1426"
    },

    /* QUICK AMOUNTS */

    quickRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 10
    },

    quickBtn: {
        backgroundColor: "#1F2937",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10
    },

    quickText: {
        color: "#8B5CF6",
        fontWeight: "600"
    },

    limitText: {
        color: "#9CA3AF",
        fontSize: 12,
        marginBottom: 14
    },

    /* UPLOAD */

    uploadBox: {
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#3A4B7A",
        borderRadius: 18,
        paddingVertical: 32,
        alignItems: "center",
        backgroundColor: "#0F1426",
        marginBottom: 18,
        overflow:"hidden"
    },

    uploadText: {
        color: "#fff",
        fontWeight: "600",
        marginTop: 8
    },

    uploadSub: {
        color: "#6B7280",
        fontSize: 12
    },

    /* IMPORTANT INFO */

    infoBox: {
        backgroundColor: "#1B223A",
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: "#5B6CFF"
    },

    infoTitle: {
        color: "#A9B4FF",
        fontWeight: "700",
        marginBottom: 6
    },

    infoText: {
        color: "#9CA3AF",
        fontSize: 13
    },

    /* SUBMIT */

    submitBtn: {
        backgroundColor: "#5B6CFF",
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: "center"
    },

    submitDisabled: {
        opacity: 0.4
    },

    submitText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700"
    },
    /* WALLET META INFO */

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


    /* SCREENSHOT PREVIEW */

    previewImage: {
        width: "100%",
        height: 150,
        borderRadius: 12,
        marginBottom: 10
    },

    uploadChange: {
        color: "#8B5CF6",
        fontSize: 13,
        fontWeight: "600"
    },


    /* TOAST */

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