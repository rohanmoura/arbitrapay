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

  /* ---------- LOGO ---------- */

  logoWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    width: 70,
    height: 70,
    borderRadius: 20,
  },

  /* ---------- HEADER ---------- */

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  appName: {
    fontSize: 30,
    fontWeight: "800",
    color: AppColors.text.primary,
    letterSpacing: 1,
  },

  tagline: {
    marginTop: 4,
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },

  /* ---------- CARD ---------- */

  card: {
    backgroundColor: AppColors.surface,
    padding: Spacing.lg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: AppColors.border,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },

    elevation: 8,
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
    marginBottom: Spacing.lg,
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
    lineHeight: 20,
  },

  email: {
    color: AppColors.accent.primary,
    fontWeight: FontWeights.semibold,
  },

  /* ---------- OTP BOXES ---------- */

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  otpBox: {
    width: 48,
    height: 56,
    backgroundColor: AppColors.input,
    borderRadius: 14,

    textAlign: "center",
    fontSize: FontSizes.lg,
    color: AppColors.text.primary,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    elevation: 4,
  },

  /* ---------- LEGACY INPUT (kept if needed) ---------- */

  input: {
    backgroundColor: AppColors.input,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: Spacing.md,
    color: AppColors.text.primary,
    fontSize: FontSizes.lg,
    textAlign: "center",
    letterSpacing: 6,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  /* ---------- BUTTON ---------- */

  buttonWrapper: {
    marginTop: Spacing.sm,
  },

  button: {
    paddingVertical: 16,
    borderRadius: 14,
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

  /* ---------- RESEND ---------- */

  resendWrapper: {
    marginTop: 18,
    alignItems: "center",
  },

  resendText: {
    color: AppColors.text.secondary,
    fontSize: FontSizes.sm,
  },
});