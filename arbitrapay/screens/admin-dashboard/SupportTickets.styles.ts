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

  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginBottom: 16,
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
    width: 42,
    height: 42,
    borderRadius: 21,
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
    borderRadius: 21,
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

  statusWrap: {
    alignItems: "flex-end",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  pendingBadge: {
    backgroundColor: "#3B2F05",
    borderColor: "#854D0E",
  },

  resolvedBadge: {
    backgroundColor: "#052E2B",
    borderColor: "#14532D",
  },

  closedBadge: {
    backgroundColor: "#1F2937",
    borderColor: "#334155",
  },

  statusText: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "700",
  },

  date: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 6,
    textAlign: "right",
  },

  section: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    gap: 10,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  label: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  value: {
    color: "#E2E8F0",
    fontSize: 13,
    lineHeight: 20,
  },

  message: {
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 20,
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    flexWrap: "wrap",
  },

  button: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },

  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  approveBtn: {
    backgroundColor: "#052E2B",
    borderColor: "#14532D",
  },

  approveText: {
    color: "#22C55E",
    fontSize: 12,
    fontWeight: "600",
  },

  deleteBtn: {
    backgroundColor: "#3F0D12",
    borderColor: "#7F1D1D",
  },

  deleteText: {
    color: "#FCA5A5",
    fontSize: 12,
    fontWeight: "600",
  },

  viewBtn: {
    backgroundColor: "#1E1B4B",
    borderColor: "#3730A3",
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
    paddingVertical: 36,
    alignItems: "center",
  },

  emptyStateText: {
    color: "#94A3B8",
    fontSize: 14,
  },
});
