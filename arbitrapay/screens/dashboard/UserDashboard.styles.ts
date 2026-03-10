import { AppColors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background.primary,
    },

    content: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.md,
        paddingBottom: 120,
    },

    // logoutBtn: {
    //     marginTop: 24,
    //     paddingVertical: 14,
    //     borderRadius: 14,
    //     alignItems: "center",
    //     backgroundColor: "rgba(255,90,95,0.15)",
    // },

    // logoutText: {
    //     color: "#FF5A5F",
    //     fontWeight: "600",
    //     fontSize: 14,
    // },
});