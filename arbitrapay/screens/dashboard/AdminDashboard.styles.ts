import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#070B16",
  },

  container: {
    flex: 1,
    backgroundColor: "#070B16",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  balanceCard: {
    backgroundColor: "#111827",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  balanceTitleWrap: {
    flex: 1,
  },

  balanceActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  balanceLabel: {
    color: "#94A3B8",
    fontSize: 13,
  },

  balanceSubLabel: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 4,
  },

  balanceAmount: {
    color: "#F8FAFC",
    fontSize: 34,
    fontWeight: "700",
    marginTop: 10,
  },

  balanceInput: {
    color: "#F8FAFC",
    fontSize: 34,
    fontWeight: "700",
    marginTop: 10,
    paddingVertical: 0,
  },

  balanceNote: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },

  balanceIconButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },

  depositSetupCard: {
    backgroundColor: "#0F172A",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  depositHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  depositTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },

  depositSubtitle: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 6,
  },

  methodTabs: {
    flexDirection: "row",
    marginTop: 18,
    backgroundColor: "#020617",
    borderRadius: 14,
    padding: 4,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },

  tabText: {
    color: "#94A3B8",
  },

  activeTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#6366F1",
  },

  activeTabText: {
    color: "#FFF",
    fontWeight: "600",
  },

  depositInfoCard: {
    backgroundColor: "#020617",
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },

  depositFieldsGroup: {
    gap: 2,
  },

  depositLabel: {
    color: "#94A3B8",
    fontSize: 12,
  },

  depositValue: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 6,
  },

  depositInput: {
    marginTop: 8,
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "600",
    paddingVertical: 0,
  },

  depositInputReadonly: {
    opacity: 0.9,
  },

  depositLoadingBox: {
    marginTop: 16,
    backgroundColor: "#020617",
    borderRadius: 14,
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  depositLoadingText: {
    color: "#94A3B8",
    fontSize: 13,
  },

  saveBtn: {
    backgroundColor: "#6366F1",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
  },

  saveText: {
    color: "#FFF",
    fontWeight: "600",
  },

  saveBtnDisabled: {
    opacity: 0.55,
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  editText: {
    color: "#A78BFA",
    fontSize: 13,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 18,
  },

  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    flex: 1,
    marginLeft: 14,
  },

  headerTextWrap: {
    flex: 1,
    marginLeft: 14,
  },

  headerTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },

  headerRight: {
    justifyContent: "center",
    alignItems: "flex-end",
  },

  headerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(139,92,246,0.15)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.35)",
  },

  headerBadgeText: {
    color: "#A78BFA",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },

  content: {
    paddingTop: 18,
    paddingBottom: 120,
    gap: 18,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#0F172A",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(167,139,250,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  statLabel: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 18,
  },

  statValue: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
  },

  historyButton: {
    backgroundColor: "#0F172A",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  historyButtonIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(148,163,184,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  historyButtonText: {
    flex: 1,
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "600",
  },

  heroCard: {
    backgroundColor: "#0F172A",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  heroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  heroIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "rgba(139,92,246,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroEyebrow: {
    color: "#94A3B8",
    fontSize: 12,
  },

  heroTitle: {
    color: "#F8FAFC",
    fontSize: 21,
    fontWeight: "700",
    marginTop: 2,
  },

  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(34,197,94,0.12)",
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },

  liveText: {
    color: "#86EFAC",
    fontSize: 12,
    fontWeight: "600",
  },

  heroSubtitle: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 16,
  },

  heroFooter: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },

  heroFooterText: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 20,
  },

  metricGrid: {
    gap: 16,
  },

  metricCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  metricLabel: {
    color: "#94A3B8",
    fontSize: 13,
  },

  metricValue: {
    color: "#F8FAFC",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 8,
  },

  metricNote: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },

  sectionCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  sectionCardTitle: {
    color: "#94A3B8",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },

  sectionCardSubtitle: {
    color: "#F8FAFC",
    fontSize: 19,
    fontWeight: "700",
    marginTop: 8,
  },

  sectionCardBody: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },

  taskText: {
    color: "#CBD5E1",
    fontSize: 14,
    flex: 1,
  },
});
