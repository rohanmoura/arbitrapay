import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  title: {
    color: "#F8FAFC",
    fontSize: 26,
    fontWeight: "700",
  },

  count: {
    color: "#64748B",
    fontSize: 18,
  },

  amountStrip: {
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#031B14",
    borderWidth: 1,
    borderColor: "#064E3B",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  amountLabel: {
    color: "#64748B",
    fontSize: 12,
  },

  amountMain: {
    color: "#22C55E",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },

  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginBottom: 14,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  input: {
    flex: 1,
    color: "#FFF",
    marginLeft: 6,
    minHeight: 44,
  },

  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#020617",
  },

  filterText: {
    color: "#CBD5F5",
    fontSize: 12,
  },

  searchBtn: {
    backgroundColor: "#111827",
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
    minWidth: 78,
    alignItems: "center",
  },

  btnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },

  dropdown: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  dropdownItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  dropdownItem: {
    color: "#E2E8F0",
  },

  tabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  activeTab: {
    backgroundColor: "#4F46E5",
  },

  tabText: {
    color: "#E2E8F0",
    fontSize: 12,
  },

  list: {
    gap: 14,
  },

  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#020617",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },

  info: {
    flex: 1,
    marginLeft: 10,
  },

  name: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "600",
  },

  email: {
    color: "#64748B",
    fontSize: 12,
  },

  amountWrap: {
    alignItems: "flex-end",
    flexShrink: 1,
  },

  amount: {
    color: "#22C55E",
    fontSize: 16,
    fontWeight: "700",
  },

  date: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 2,
    textAlign: "right",
  },

  methodRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  methodChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#1E1B4B",
  },

  methodText: {
    color: "#A78BFA",
    fontSize: 11,
    fontWeight: "600",
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },

  approvedBadge: {
    backgroundColor: "#052E2B",
    borderWidth: 1,
    borderColor: "#14532D",
  },

  pendingBadge: {
    backgroundColor: "#3B2F05",
    borderWidth: 1,
    borderColor: "#854D0E",
  },

  badgeText: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "600",
  },

  details: {
    marginTop: 12,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    paddingTop: 10,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  detail: {
    color: "#94A3B8",
    fontSize: 12,
    flexShrink: 1,
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },

  btnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  approveBtn: {
    backgroundColor: "#052E2B",
    borderWidth: 1,
    borderColor: "#14532D",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  approveText: {
    color: "#22C55E",
    fontSize: 12,
    fontWeight: "600",
  },

  pendingBtn: {
    backgroundColor: "#3B2F05",
    borderWidth: 1,
    borderColor: "#854D0E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  pendingText: {
    color: "#FBBF24",
    fontSize: 12,
    fontWeight: "600",
  },

  viewBtn: {
    backgroundColor: "#1E1B4B",
    borderWidth: 1,
    borderColor: "#3730A3",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  viewBtnDisabled: {
    opacity: 0.8,
  },

  viewText: {
    color: "#A5B4FC",
    fontSize: 12,
    fontWeight: "600",
  },

  disabledBtn: {
    opacity: 0.75,
  },

  loadMoreBtn: {
    marginTop: 4,
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  loadMoreText: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "600",
  },

  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },

  emptyStateText: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
  },
});
