import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: "#0B1220"
    },

    container: {
        padding: 20
    },

    aiCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#151A2E",
        borderRadius: 22,
        padding: 20,
        marginBottom: 20
    },

    aiIcon: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: "#5B6CFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14
    },

    aiTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700"
    },

    aiDesc: {
        color: "#9CA3AF",
        marginTop: 4
    },

    chatArea: {
        gap: 14,
        marginTop: 6,
        marginBottom: 20
    },

    botRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10
    },

    userRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        gap: 10
    },  

    botIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#5B6CFF",
        justifyContent: "center",
        alignItems: "center"
    },

    botMessage: {
        backgroundColor: "#1E293B",
        borderRadius: 16,
        padding: 14,
        maxWidth: "80%"
    },

    userMessage: {
        backgroundColor: "#5B6CFF",
        borderRadius: 16,
        padding: 14,
        maxWidth: "80%"
    },

    messageText: {
        color: "#fff",
        lineHeight: 20
    },

    inputWrapper: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#1F2937"
    },

    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#151A2E",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 8
    },

    input: {
        flex: 1,
        color: "#fff"
    },

    sendBtn: {
        backgroundColor: "#5B6CFF",
        padding: 10,
        borderRadius: 10
    },

    quickContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 14,
        gap: 10
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

    userIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#374151",
        justifyContent: "center",
        alignItems: "center"
    },

    quickBtn: {
        backgroundColor: "#1E293B",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        width: "48%"
    },

    quickText: {
        color: "#CBD5F5",
        fontSize: 13
    }

});