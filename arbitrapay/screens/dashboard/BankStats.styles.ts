import { AppColors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    gap: 14,
    marginBottom: Spacing.lg
  },


  /* BIG CARD */

  bigCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 18,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)"
  },

  bigHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },

  bankInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },

  bigLabel: {
    fontSize: 15,
    color: AppColors.text.secondary
  },

  bigValue: {
    fontSize: 22,
    fontWeight: "700",
    color: AppColors.text.primary
  },

  emptyText: {
    fontSize: 13,
    color: AppColors.text.secondary,
    marginBottom: 12
  },


  /* BUTTON */

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,

    backgroundColor: AppColors.accent.primary,

    paddingVertical: 12,
    borderRadius: 12
  },

  addText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600"
  },


  /* GRID */

  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  statCard: {
    width: "48%",
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    padding: 16,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)"
  },

  statLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  iconBlue: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(59,130,246,0.15)",
    alignItems: "center",
    justifyContent: "center"
  },

  statLabel: {
    fontSize: 13,
    color: AppColors.text.secondary
  },

  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.text.primary,
    marginTop: 2
  },

  /* progress */

  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    marginTop: 10
  },

  progressBar: {
    width: "0%",
    height: 4,
    backgroundColor: "#EF4444",
    borderRadius: 2
  }

});