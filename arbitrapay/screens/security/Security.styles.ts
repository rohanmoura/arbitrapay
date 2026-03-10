import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#0B1220",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 40
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
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
        padding: 18
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#1F2937",
        gap: 10
    },

    rowText: {
        color: "#fff",
        fontSize: 15,
        flex: 1
    },

    status: {
        color: "#22C55E",
        fontSize: 13
    },

    warning: {
        color: "#F59E0B",
        fontSize: 13
    },

    sectionTitle: {
        color: "#9CA3AF",
        fontSize: 13,
        marginBottom: 10
    },

    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 14
    },

    addText: {
        color: "#8B5CF6",
        fontSize: 14
    },

    safe: {
        flex: 1,
        backgroundColor: "#0B1220"
    },

    securityCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#111827",
        padding: 16,
        borderRadius: 16,
        marginBottom: 24
    },

    securityTitle: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600"
    },

    securitySub: {
        color: "#9CA3AF",
        fontSize: 12,
        marginTop: 2
    },

});