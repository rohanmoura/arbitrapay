import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020617",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    marginBottom: 16,
  },

  headerTitle: {
    color: "#E2E8F0",
    fontSize: 18,
    fontWeight: "600",
  },

  headerSpacer: {
    width: 22,
  },

  userCard: {
    alignItems: "center",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 20,
    backgroundColor: "#020617",
  },

  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
  },

  avatarText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 20,
  },

  userName: {
    color: "#fff",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "600",
  },

  userEmail: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },

  userMeta: {
    color: "#A5B4FC",
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
  },

  mainCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#020617",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  topMeta: {
    flex: 1,
  },

  topLabel: {
    color: "#64748B",
    fontSize: 11,
    marginBottom: 4,
  },

  topValue: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },

  topSubValue: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  approvedBadge: {
    backgroundColor: "#052E2B",
    borderColor: "#14532D",
  },

  pendingBadge: {
    backgroundColor: "#3F1D1D",
    borderColor: "#7F1D1D",
  },

  badgeText: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#1E293B",
    marginVertical: 16,
  },

  section: {
    gap: 12,
  },

  sectionTitle: {
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "600",
  },

  sectionSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },

  detailGrid: {
    gap: 12,
  },

  detailBlock: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#0B1220",
    gap: 8,
  },

  detailLabel: {
    color: "#64748B",
    fontSize: 11,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  detailText: {
    flex: 1,
    color: "#E2E8F0",
    fontSize: 13,
  },

  fieldActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  summaryCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#020617",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  summaryMeta: {
    flex: 1,
  },

  summaryLabel: {
    color: "#64748B",
    fontSize: 11,
    marginBottom: 4,
  },

  summaryValue: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "700",
  },

  summaryHint: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },

  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },

  secondaryBtnText: {
    color: "#CBD5F5",
    fontSize: 12,
    fontWeight: "600",
  },

  disabledBtn: {
    opacity: 0.6,
  },

  actionsWrap: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },

  approveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#052E2B",
    borderWidth: 1,
    borderColor: "#14532D",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },

  approveText: {
    color: "#22C55E",
    fontSize: 12,
    fontWeight: "600",
  },

  liveDepositBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1E1B4B",
    borderWidth: 1,
    borderColor: "#3730A3",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },

  liveDepositText: {
    color: "#A5B4FC",
    fontSize: 12,
    fontWeight: "600",
  },

  otherWrap: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
  },

  otherTitle: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  otherSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginBottom: 14,
  },

  otherList: {
    gap: 14,
  },

  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  toastText: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "600",
  },
});
