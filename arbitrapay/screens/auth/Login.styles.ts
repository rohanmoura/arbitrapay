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

  /* ---------------- HEADER ---------------- */

  header: {
    alignItems: "center",
    marginBottom: 50,
  },

  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: AppColors.text.primary,
    letterSpacing: 1.2,
  },

  tagline: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
    opacity: 0.85,
  },

  /* ---------------- CARD ---------------- */

  card: {
    backgroundColor: AppColors.surface,
    padding: Spacing.xl,
    borderRadius: 26,

    borderWidth: 1,
    borderColor: AppColors.border,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },

    elevation: 10,
  },

  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: AppColors.text.primary,
  },

  highlight: {
    color: AppColors.accent.primary,
  },

  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
    lineHeight: 20,
  },

  /* ---------------- INPUT ---------------- */

  input: {
    backgroundColor: AppColors.input,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,

    marginBottom: Spacing.md,

    color: AppColors.text.primary,
    fontSize: FontSizes.md,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  /* ---------------- BUTTONS ---------------- */

  buttonWrapper: {
    marginTop: Spacing.sm,
  },

  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    elevation: 6,
  },

  buttonText: {
    color: AppColors.text.primary,
    fontWeight: FontWeights.semibold,
    fontSize: FontSizes.md,
  },

  /* ---------------- GOOGLE BUTTON ---------------- */

  googleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  googleButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: Spacing.sm,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    elevation: 4,
  },

  googleText: {
    color: "#000",
    fontWeight: FontWeights.semibold,
    fontSize: FontSizes.md,
  },

  /* ---------------- DIVIDER ---------------- */

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  dividerText: {
    marginHorizontal: Spacing.sm,
    fontSize: 12,
    color: AppColors.text.secondary,
    opacity: 0.7,
  },

  /* ---------------- SWITCH TEXT ---------------- */

  switchText: {
    marginTop: Spacing.lg,
    textAlign: "center",
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },

  switchHighlight: {
    color: AppColors.accent.primary,
    fontWeight: FontWeights.semibold,
  },

  logoWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    width: 70,
    height: 70,
    borderRadius: 20,
  },
});