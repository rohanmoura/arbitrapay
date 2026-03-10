import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#0B1220",
        paddingHorizontal: 20,
        paddingTop: 60
    },

    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#111827",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20
    },

    title: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 30
    },

    pinInput: {
        backgroundColor: "#111827",
        borderRadius: 16,
        paddingVertical: 16,
        textAlign: "center",
        fontSize: 22,
        letterSpacing: 10,
        color: "#fff",
        marginBottom: 16
    },

    helper: {
        color: "#9CA3AF",
        fontSize: 13,
        marginBottom: 30
    },

    error: {
        color: "#EF4444",
        fontSize: 13,
        marginBottom: 10
    },

    button: {
        backgroundColor: "#8B5CF6",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center"
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    }

});