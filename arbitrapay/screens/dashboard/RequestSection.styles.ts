import { StyleSheet } from "react-native";
import { AppColors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";

export const styles = StyleSheet.create({

  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",

    marginBottom: Spacing.lg,

    overflow: "hidden",
  },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.text.primary,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  empty: {
    height: 140,

    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  emptyText: {
    color: AppColors.text.secondary,
    fontSize: 14,
  },

});