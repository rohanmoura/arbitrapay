import { AppColors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    overflow: "hidden", // important for glow
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6
  },

  walletTitle: {
    color: AppColors.text.secondary,
    fontSize: 13,
    letterSpacing: 0.8,
    opacity: 0.85,
  },

  balance: {
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: AppColors.text.primary,
  },

  balanceSub: {
    fontSize: 13,
    color: AppColors.text.secondary,
    marginTop: 2,
    marginBottom: 20,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
  },

  depositBtn: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    backgroundColor: AppColors.accent.primary,

    paddingVertical: 14,
    borderRadius: 14,
  },

  depositText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  withdrawBtn: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    backgroundColor: "rgba(255,255,255,0.06)",

    paddingVertical: 14,
    borderRadius: 14,
  },

  withdrawText: {
    color: AppColors.text.primary,
    fontWeight: "600",
    fontSize: 15,
  },

  glow: {
    position: "absolute",

    width: 220,
    height: 220,

    top: -80,
    right: -80,

    borderRadius: 200,

    opacity: 0.35,
  },

  greetingRow: {
    marginBottom: 10,
  },

  greetingText: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.text.primary,
  },

  cardWrapper: {
    position: "relative",
    marginBottom: 24
  },

  borderGlow: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 24,
    opacity: 0.55
  },



  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 12
  },

  commissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18
  },

  commissionLabel: {
    color: AppColors.text.secondary,
    fontSize: 13
  },

  commissionValue: {
    color: "#22D3EE",
    fontWeight: "600"
  },

  logo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    opacity: 0.9,
    borderRadius: 50
  }

});