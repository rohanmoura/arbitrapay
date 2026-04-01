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
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#020617",
    marginBottom: 18,
  },

  userTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 31,
  },

  avatarText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 20,
  },

  userMeta: {
    flex: 1,
  },

  userName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  userEmail: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },

  totalDepositCard: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
  },

  sectionLabel: {
    color: "#64748B",
    fontSize: 11,
    marginBottom: 4,
  },

  totalDepositAmount: {
    color: "#22C55E",
    fontSize: 24,
    fontWeight: "700",
  },

  totalDepositHint: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },

  bankCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#3730A3",
    backgroundColor: "#0B1120",
    marginBottom: 18,
  },

  bankTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  bankTitleWrap: {
    flex: 1,
  },

  bankTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },

  bankSubtitle: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#052E2B",
    borderWidth: 1,
    borderColor: "#14532D",
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

  detailGrid: {
    gap: 12,
  },

  detailBlock: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#020617",
  },

  detailLabel: {
    color: "#64748B",
    fontSize: 11,
    marginBottom: 8,
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

  secondaryBtn: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  secondaryBtnText: {
    color: "#CBD5F5",
    fontSize: 12,
    fontWeight: "600",
  },

  formCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#020617",
    marginBottom: 18,
  },

  sectionTitle: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "600",
  },

  sectionSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },

  typeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  typeChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
    alignItems: "center",
    backgroundColor: "#111827",
  },

  typeChipActive: {
    backgroundColor: "#1E1B4B",
    borderColor: "#4338CA",
  },

  typeChipText: {
    color: "#CBD5F5",
    fontSize: 13,
    fontWeight: "600",
  },

  typeChipTextActive: {
    color: "#C7D2FE",
  },

  inputLabel: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 18,
    marginBottom: 8,
  },

  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#0B1220",
    color: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
  },

  sendBtn: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
  },

  sendBtnDisabled: {
    opacity: 0.7,
  },

  sendBtnText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },

  historyCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#020617",
  },

  historyList: {
    gap: 14,
    marginTop: 16,
  },

  historyItem: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#0B1220",
  },

  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },

  historyBody: {
    flex: 1,
    gap: 6,
  },

  historyTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  historyAmount: {
    fontSize: 16,
    fontWeight: "700",
  },

  historyType: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "600",
    overflow: "hidden",
  },

  historyMeta: {
    color: "#94A3B8",
    fontSize: 12,
  },

  historyStatus: {
    color: "#CBD5F5",
    fontSize: 12,
  },

  emptyState: {
    marginTop: 16,
    paddingVertical: 24,
    alignItems: "center",
  },

  emptyStateText: {
    color: "#94A3B8",
    fontSize: 13,
    textAlign: "center",
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
