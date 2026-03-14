import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 20,
        paddingBottom: 60,
        paddingTop: 20,
    },

    title: {
        color: "#fff",
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 25
    },

    profileCard: {
        alignItems: "center",
        marginBottom: 30
    },

    avatarWrapper: {
        position: "relative"
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50
    },

    editAvatar: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#8B5CF6",
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center"
    },

    email: {
        marginTop: 10,
        color: "#9CA3AF",
        fontSize: 14
    },

    card: {
        backgroundColor: "#111827",
        borderRadius: 18,
        padding: 18,
        marginBottom: 30
    },

    sectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 16
    },

    label: {
        color: "#9CA3AF",
        fontSize: 13,
        marginBottom: 6
    },

    input: {
        backgroundColor: "#0B1220",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: "#fff",
        fontSize: 15,
        borderWidth: 1,
        borderColor: "#1F2937",
        marginBottom: 14
    },

    phoneContainer: {
        flexDirection: "row",
        gap: 10
    },

    codeBox: {
        backgroundColor: "#0B1220",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#1F2937",
        minWidth: 72,
        alignItems: "center"
    },

    codeText: {
        color: "#fff",
        fontSize: 15
    },

    phoneInput: {
        flex: 1,
        backgroundColor: "#0B1220",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: "#fff",
        fontSize: 15,
        borderWidth: 1,
        borderColor: "#1F2937"
    },

    saveBtn: {
        backgroundColor: "#8B5CF6",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center"
    },

    saveText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },

    safe: {
        flex: 1,
        backgroundColor: "#0B1220"
    },

    codeDropdown: {
        marginTop: 10,
        backgroundColor: "#111827",
        borderRadius: 10
    },

    codeItem: {
        padding: 12
    },

    codeItemText: {
        color: "#fff"
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 14
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

    logout: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
        marginTop: 20
    },

    logoutText: {
        color: "#EF4444",
        fontSize: 15
    },

    version: {
        textAlign: "center",
        color: "#6B7280",
        marginTop: 10,
        fontSize: 12
    },

    disabledButton: {
        opacity: 0.7
    }


});
