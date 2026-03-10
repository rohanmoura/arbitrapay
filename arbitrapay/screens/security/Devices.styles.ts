import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    safe: {
        flex: 1,
        backgroundColor: "#0B1220"
    },

    container: {
        paddingHorizontal: 20
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 10,
        marginBottom: 30
    },

    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#111827",
        justifyContent: "center",
        alignItems: "center"
    },

    title: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700"
    },

    card: {
        backgroundColor: "#111827",
        borderRadius: 16,
        padding: 18,
        marginBottom: 20
    },

    sectionTitle: {
        color: "#9CA3AF",
        fontSize: 13,
        marginBottom: 14
    },

    deviceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },

    deviceName: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600"
    },

    deviceInfo: {
        color: "#6B7280",
        fontSize: 12
    },

    active: {
        color: "#22C55E",
        fontSize: 12
    },

    logoutRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 10
    },

    logoutText: {
        color: "#EF4444",
        fontSize: 14
    }

});