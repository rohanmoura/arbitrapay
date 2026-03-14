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

    /* TOP CARD */

    topCard: {
        borderRadius: 24,
        padding: 22,
        marginBottom: 24,
        backgroundColor: "#151A2E",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)"
    },

    topLabel: {
        color: "#7C8DB5",
        fontSize: 12,
        letterSpacing: 1
    },

    topTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
        marginTop: 6
    },

    topDesc: {
        color: "#9CA3AF",
        fontSize: 13,
        marginTop: 6,
        marginBottom: 18
    },

    addTopBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 14,
        paddingVertical: 14,
        backgroundColor: "#5B6CFF",
        paddingHorizontal: 18,
        alignSelf: "flex-start"
    },

    addTopText: {
        color: "#fff",
        fontWeight: "700"
    },

    /* MAIN CARD */

    card: {
        backgroundColor: "#12172A",
        borderRadius: 22,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)"
    },

    bankCardSelected: {
        borderColor: "#5B6CFF",
        backgroundColor: "#131A31"
    },

    /* EMPTY STATE */

    emptyBox: {
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#2D395C",
        borderRadius: 18,
        paddingVertical: 32,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "#0F1426",
        marginBottom: 20
    },

    emptyIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#182038",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14
    },

    emptyTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600"
    },

    emptyDesc: {
        color: "#94A3B8",
        fontSize: 13,
        textAlign: "center",
        lineHeight: 20,
        marginTop: 8,
        marginBottom: 20
    },

    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 14,
        paddingVertical: 14,
        backgroundColor: "#5B6CFF",
        paddingHorizontal: 18,
        minWidth: 200
    },

    addBtnText: {
        color: "#fff",
        fontWeight: "700"
    },

    /* BANK CARD */

    bankCard: {
        flexDirection: "row",
        backgroundColor: "#0F1426",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "#1E2746",
        marginBottom: 16,
    },

    bankIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#182038",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14
    },

    bankRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },

    bankName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700"
    },

    primaryTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: "rgba(251,191,36,0.14)",
        borderWidth: 1,
        borderColor: "rgba(251,191,36,0.22)"
    },

    primaryText: {
        color: "#FBBF24",
        fontSize: 11,
        fontWeight: "700"
    },

    bankHolder: {
        color: "#C7D2FE",
        marginTop: 6,
        fontWeight: "600"
    },

    bankMeta: {
        color: "#94A3B8",
        fontSize: 13,
        marginTop: 4
    },

    accountRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 4
    },

    required: {
        color: "#EF4444",
        fontWeight: "700"
    },

    submitDisabled: {
        opacity: 0.4
    },

    bankActions: {
        flexDirection: "row",
        marginTop: 12,
        gap: 10
    },

    primaryBtn: {
        backgroundColor: "#1E293B",
        borderColor: "#5B6CFF",
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10
    },

    primaryBtnText: {
        color: "#8EA2FF",
        fontWeight: "600",
        fontSize: 12
    },

    deleteBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderWidth: 1,
        borderColor: "#EF4444",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10
    },

    deleteText: {
        color: "#EF4444",
        fontWeight: "600",
        fontSize: 12
    },

    /* INFO BOX */

    infoBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        backgroundColor: "#161E34",
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#27314F"
    },

    infoIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(251,191,36,0.15)"
    },

    infoTitle: {
        color: "#FDE68A",
        fontWeight: "700",
        marginBottom: 6
    },

    infoText: {
        color: "#9CA3AF",
        fontSize: 13,
        lineHeight: 20
    },

    /* MODAL */

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end",
        alignItems: "center"
    },

    modalCard: {
        backgroundColor: "#12172A",
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        padding: 22,
        borderWidth: 1,
        borderColor: "#27314F",
        width: "100%",
        height: "90%",
        maxHeight: "90%"
    },

    errorText: {
        color: "#EF4444",
        fontSize: 12,
        marginTop: 4,
        marginBottom: 6
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },

    modalTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700"
    },

    modalDesc: {
        color: "#9CA3AF",
        fontSize: 13,
        marginBottom: 16
    },

    inputLabel: {
        color: "#fff",
        fontSize: 14,
        marginBottom: 8,
        marginTop: 8
    },

    input: {
        borderWidth: 1,
        borderColor: "#2B3553",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
        color: "#fff",
        backgroundColor: "#0F1426",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10
    },

    submitBtn: {
        backgroundColor: "#10B981",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 6
    },

    submitText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16
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
    },

    helperText: {
        color: "#6B7280",
        fontSize: 12,
        marginBottom: 6
    }

});
