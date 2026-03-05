import { StyleSheet } from "react-native";
import { AppColors } from "@/theme/colors";
import { FontSizes, FontWeights } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: AppColors.surface,
    padding: Spacing.lg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: AppColors.text.primary,
  },
  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },
  input: {
    backgroundColor: AppColors.input,
    padding: Spacing.md,
    borderRadius: 14,
    marginBottom: Spacing.md,
    color: AppColors.text.primary,
    fontSize: FontSizes.md,
    textAlign: "center",
    letterSpacing: 4,
  },
  buttonWrapper: {
    marginTop: Spacing.sm,
  },
  button: {
    padding: Spacing.md,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: AppColors.text.primary,
    fontWeight: FontWeights.semibold,
    fontSize: FontSizes.md,
  },
});