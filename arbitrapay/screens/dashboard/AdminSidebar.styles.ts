import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    flexDirection: "row-reverse",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  drawer: {
    width: 292,
    backgroundColor: "#090E1A",
    paddingTop: 46,
    paddingBottom: 40,
    paddingHorizontal: 18,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.04)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },

  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(139,92,246,0.18)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    marginLeft: 12,
  },

  appName: {
    color: "#F8FAFC",
    fontSize: 17,
    fontWeight: "700",
  },

  sub: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },

  menu: {
    gap: 6,
    marginTop: 12,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
  },

  activeItem: {
    backgroundColor: "rgba(139,92,246,0.14)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.30)",
  },

  label: {
    marginLeft: 13,
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "500",
  },

  activeLabel: {
    color: "#C4B5FD",
  },

  footer: {
    marginTop: "auto",
    paddingTop: 22,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: "rgba(239,68,68,0.08)",
  },

  logoutText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
  },
});
