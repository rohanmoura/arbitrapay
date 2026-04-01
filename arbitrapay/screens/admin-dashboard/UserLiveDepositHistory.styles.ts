import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020617",
  },

  container: {
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

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
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
    fontSize: 20,
    fontWeight: "700",
  },

  statLabel: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 2,
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

  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  filterText: {
    color: "#CBD5F5",
    fontSize: 12,
  },

  dropdown: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
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

  card: {
    backgroundColor: "#020617",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
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

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 21,
  },

  avatarText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    color: "#F8FAFC",
    fontWeight: "600",
    fontSize: 14,
  },

  email: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },

  amountWrap: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 16,
    fontWeight: "700",
  },

  date: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#1E293B",
    marginVertical: 14,
  },

  section: {
    gap: 8,
  },

  sectionTitle: {
    color: "#64748B",
    fontSize: 11,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  detailText: {
    color: "#CBD5F5",
    fontSize: 13,
    flex: 1,
  },

  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "600",
    overflow: "hidden",
    alignSelf: "flex-start",
  },

  statusText: {
    color: "#94A3B8",
    fontSize: 12,
  },

  bottomRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewBtn: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },

  viewText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
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
