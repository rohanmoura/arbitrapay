import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16, // 🔥 ADD THIS
    marginBottom: 16,
  },

  title: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "700",
  },

  userCard: {
    alignItems: "center",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 20,
  },

  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 20,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
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
  },

  userMeta: {
    color: "#A5B4FC",
    marginTop: 6,
    fontSize: 12,
  },

  mainCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 20,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  amountBig: {
    color: "#22C55E",
    fontSize: 22,
    fontWeight: "700",
  },

  date: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 2,
  },

  badge: {
    backgroundColor: "#052E2B",
    borderWidth: 1,
    borderColor: "#14532D",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },

  badgeText: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "600",
  },

  methodChip: {
    marginTop: 10,
    alignSelf: "flex-start",
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

  section: {
    marginTop: 14,
  },

  sectionTitle: {
    color: "#64748B",
    fontSize: 11,
    marginBottom: 6,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },

  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  detail: {
    color: "#94A3B8",
    fontSize: 12,
  },

  proofImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginTop: 6,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  approveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1E1B4B",
    borderWidth: 1,
    borderColor: "#3730A3",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  viewText: {
    color: "#A5B4FC",
    fontSize: 12,
    fontWeight: "600",
  },

  disabledBtn: {
    opacity: 0.75,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#020617",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  headerTitle: {
    color: "#E2E8F0",
    fontSize: 18,
    fontWeight: "600",
  },

  headerSpacer: {
    width: 22,
  },

  methodRow: {
    marginTop: 10,
    alignItems: "flex-end",
  },

  divider: {
    height: 1,
    backgroundColor: "#1E293B",
    marginVertical: 14,
  },

  block: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  proofWrap: {
    marginTop: 8,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  actionsWrap: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
  },

  otherWrap: {
    marginTop: 10,
  },

  label: {
    color: "#64748B",
    fontSize: 10,
    marginTop: 8,
  },

  utrRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  emptyProof: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
    padding: 16,
    alignItems: "center",
  },

  emptyProofText: {
    color: "#64748B",
    fontSize: 12,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: "100%",
    height: "80%",
  },

  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
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

  otherTitle: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  otherList: {
    gap: 14,
  },
});
