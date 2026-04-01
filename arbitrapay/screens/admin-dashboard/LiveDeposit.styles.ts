import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 0,
  },

  title: {
    color: "#F8FAFC",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 18,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  statNumber: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "700",
  },

  statLabel: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 2,
  },

  historyBtn: {
    marginBottom: 16,
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  historyBtnText: {
    color: "#CBD5F5",
    fontSize: 13,
    fontWeight: "600",
  },

  controls: {
    flexDirection: "row",
    gap: 10,
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
    color: "#E2E8F0",
    marginLeft: 6,
    fontSize: 13,
  },

  searchBtn: {
    backgroundColor: "#111827",
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  searchBtnText: {
    color: "#CBD5F5",
    fontSize: 12,
    fontWeight: "600",
  },

  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  sortText: {
    color: "#CBD5F5",
    fontSize: 12,
  },

  dropdown: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  dropdownItem: {
    color: "#E2E8F0",
    paddingVertical: 6,
  },

  list: {
    gap: 14,
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
