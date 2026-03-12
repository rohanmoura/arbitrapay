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

    updateCard: {
        flexDirection: "row",
        backgroundColor: "#151A2E",
        borderRadius: 16,
        marginBottom: 14,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#1F2937"
    },

    updateHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },

    adminBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0F172A",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8
    },

    adminText: {
        color: "#8B5CF6",
        fontSize: 12,
        marginLeft: 4,
        fontWeight: "600"
    },

    updateDate: {
        color: "#9CA3AF",
        fontSize: 12
    },

    updateContent: {
        color: "#E5E7EB",
        lineHeight: 20,
        fontSize: 14
    },



    updateAccent: {
        width: 4,
        backgroundColor: "#8B5CF6"
    },

    updateContentWrap: {
        flex: 1,
        padding: 16
    },

    dateRow: {
        flexDirection: "row",
        alignItems: "center"
    },

    newBadge: {
        backgroundColor: "#22C55E20",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 6
    },

    newText: {
        color: "#22C55E",
        fontSize: 10,
        fontWeight: "600"
    },

});