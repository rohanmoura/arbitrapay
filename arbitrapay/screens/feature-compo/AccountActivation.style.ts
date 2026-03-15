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
        marginBottom: 20
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

    pageTitle: {
        color: "#94A3B8",
        marginBottom: 20
    },

    progressWrap: {
        marginBottom: 20
    },

    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },

    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#374151"
    },

    progressActive: {
        backgroundColor: "#8B5CF6"
    },

    progressLine: {
        width: 40,
        height: 2,
        backgroundColor: "#374151"
    },

    progressText: {
        textAlign: "center",
        color: "#9CA3AF",
        marginTop: 6
    },

    card: {
        backgroundColor: "#151A2E",
        padding: 20,
        borderRadius: 20
    },

    cardHeader: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        marginBottom: 16
    },

    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center"
    },

    cardTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },

    cardDesc: {
        color: "#9CA3AF",
        fontSize: 12
    },

    securityCard: {
        flexDirection: "row",
        gap: 10,
        backgroundColor: "#0F172A",
        padding: 14,
        borderRadius: 12,
        marginBottom: 18
    },

    securityText: {
        flex: 1,
        color: "#CBD5F5",
        fontSize: 13,
        lineHeight: 18
    },

    label: {
        color: "#E5E7EB",
        marginTop: 14,
        marginBottom: 6,
        fontSize: 13
    },

    error: {
        color: "#EF4444",
        fontSize: 12,
        marginTop: 4
    },

    infoBox: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
        backgroundColor: "#1E293B",
        padding: 14,
        borderRadius: 12
    },

    infoText: {
        color: "#CBD5F5",
        flex: 1,
        fontSize: 13,
        lineHeight: 18
    },

    disabledBtn: {
        opacity: 0.45
    },

    submitBtn: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 14,
        borderRadius: 14,
        backgroundColor: "#7C3AED"
    },

    submitText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15
    },

    stepBackBtn: {
        marginTop: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6
    },

    stepBackText: {
        color: "#9CA3AF",
        fontSize: 13,
        fontWeight: "500"
    },

    toast: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: "#111827",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10
    },

    toastText: {
        color: "#fff"
    },

    passwordWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0F172A",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#1F2937",
        paddingHorizontal: 12
    },

    passwordInput: {
        flex: 1,
        color: "#fff",
        paddingVertical: 12,
        marginLeft: 8
    },

    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0F172A",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#1F2937",
        paddingHorizontal: 14,
        gap: 8
    },

    inputField: {
        flex: 1,
        color: "#fff",
        paddingVertical: 12,
        marginLeft: 8
    }


});
