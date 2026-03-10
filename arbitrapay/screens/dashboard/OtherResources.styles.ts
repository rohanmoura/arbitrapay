import { AppColors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        marginBottom: Spacing.lg
    },

    title: {
        fontSize: 16,
        fontWeight: "600",
        color: AppColors.text.primary,
        marginBottom: 12
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    card: {
        width: "31%",

        backgroundColor: AppColors.surface,
        borderRadius: 16,

        paddingVertical: 18,
        paddingHorizontal: 10,

        alignItems: "center",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",

        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,

        position: "relative"
    },

    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,

        justifyContent: "center",
        alignItems: "center"
    },

    blue: {
        backgroundColor: "rgba(77,163,255,0.15)"
    },

    green: {
        backgroundColor: "rgba(61,220,151,0.15)"
    },

    purple: {
        backgroundColor: "rgba(176,132,245,0.15)"
    },

    label: {
        marginTop: 8,
        fontSize: 12,
        color: AppColors.text.secondary,
        textAlign: "center"
    },

    badge: {
        position: "absolute",
        top: 8,
        right: 8,

        backgroundColor: "#FF3B30",

        paddingHorizontal: 6,
        paddingVertical: 2,

        borderRadius: 6
    },

    badgeText: {
        fontSize: 9,
        color: "#fff",
        fontWeight: "700"
    }

});