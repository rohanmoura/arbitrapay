import { StyleSheet } from "react-native";
import { AppColors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";

export const styles = StyleSheet.create({

  safeArea: {
    backgroundColor: AppColors.background.primary,
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  iconButton: {
    padding: 6,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.accent.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  notification: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },

});