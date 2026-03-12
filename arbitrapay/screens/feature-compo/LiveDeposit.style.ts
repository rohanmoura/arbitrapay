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

    pageDesc: {
        color: "#94A3B8",
        marginBottom: 22
    },

    /* Activation Card */

    activationCard: {
        backgroundColor: "#151A2E",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#1F2937"
    },

    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#8B5CF620",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14
    },

    activationTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 6
    },

    activationDesc: {
        textAlign: "center",
        color: "#94A3B8",
        lineHeight: 20,
        marginBottom: 20
    },

    activateBtn: {
        backgroundColor: "#8B5CF6",
        paddingVertical: 12,
        paddingHorizontal: 26,
        borderRadius: 12
    },

    activateText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15
    },

    /* Instruction Card */

    infoCard: {
        backgroundColor: "#0F172A",
        borderRadius: 18,
        padding: 20,
        borderWidth: 1,
        borderColor: "#1F2937"
    },

    infoTitle: {
        fontWeight: "700",
        fontSize: 16,
        marginBottom: 14,
        color: "#E5E7EB"
    },

    stepRow: {
        flexDirection: "row",
        marginBottom: 12
    },

    stepNumber: {
        color: "#8B5CF6",
        fontWeight: "700",
        marginRight: 8
    },

    stepText: {
        flex: 1,
        color: "#9CA3AF",
        lineHeight: 20
    },

    /* STATUS BADGE */

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: "#1F2937",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12
    },

    statusText: {
        color: "#F59E0B",
        fontSize: 12,
        marginLeft: 6,
        fontWeight: "600"
    },


    /* LOCK NOTICE */

    lockCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0F172A",
        borderRadius: 12,
        padding: 14,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#1F2937"
    },

    lockText: {
        flex: 1,
        color: "#9CA3AF",
        marginLeft: 8,
        fontSize: 13,
        lineHeight: 18
    },

});