import { AppColors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    marginBottom: Spacing.lg,
    gap: 14
  },

  row: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: AppColors.surface,
    borderRadius: 16,

    paddingVertical: 18,
    paddingHorizontal: 18,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },

  accent: {
    width: 4,
    height: 26,
    borderRadius: 6,
    marginRight: 12
  },

  icon: {
    marginRight: 8,
    opacity: 0.65,
    color: AppColors.text.secondary
  },

  label: {
    flex: 1,
    fontSize: 14,
    color: AppColors.text.secondary
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.text.primary
  },

  valueReferral: {
    color: "#22D3EE"
  },

  valueLocked: {
    color: "#FF6B6B"
  },

  valuePending: {
    color: "#B084F5"
  }

});