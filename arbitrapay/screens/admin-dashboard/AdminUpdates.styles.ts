import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
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
  newButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  newButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  tabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  tabButtonActive: {
    backgroundColor: "#1E1B4B",
    borderColor: "#4338CA",
  },
  tabText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#E0E7FF",
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
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  cardTitle: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  statusBadgeActive: {
    backgroundColor: "#052E2B",
    borderColor: "#14532D",
  },
  statusBadgeInactive: {
    backgroundColor: "#3F0D12",
    borderColor: "#7F1D1D",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextActive: {
    color: "#22C55E",
  },
  statusTextInactive: {
    color: "#FCA5A5",
  },
  message: {
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  date: {
    color: "#64748B",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    flexWrap: "wrap",
  },
  button: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewBtn: {
    backgroundColor: "#1E1B4B",
    borderColor: "#3730A3",
  },
  viewText: {
    color: "#A5B4FC",
    fontSize: 12,
    fontWeight: "700",
  },
  editBtn: {
    backgroundColor: "#172554",
    borderColor: "#1D4ED8",
  },
  editText: {
    color: "#93C5FD",
    fontSize: 12,
    fontWeight: "700",
  },
  deleteBtn: {
    backgroundColor: "#3F0D12",
    borderColor: "#7F1D1D",
  },
  deleteText: {
    color: "#FCA5A5",
    fontSize: 12,
    fontWeight: "700",
  },
  toggleBtn: {
    backgroundColor: "#111827",
    borderColor: "#334155",
  },
  toggleText: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "700",
  },
  disabledBtn: {
    opacity: 0.7,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },
});
