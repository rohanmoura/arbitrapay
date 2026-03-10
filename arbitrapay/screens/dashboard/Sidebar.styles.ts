import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 10
  },

  drawer: {
    position: "absolute",
    width: 290,
    height: "100%",
    backgroundColor: "#0A0F1F",
    paddingTop: 60,
    paddingHorizontal: 22,
    zIndex: 20,

    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40
  },

  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12
  },

  appName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.4
  },

  sub: {
    color: "#9CA3AF",
    fontSize: 12
  },

  menu: {
    gap: 18
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10
  },

  label: {
    marginLeft: 14,
    fontSize: 15,
    color: "#E5E7EB",
    fontWeight: "500"
  },

  logoutContainer: {
    marginTop: "auto",
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)"
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(239,68,68,0.08)"
  },

  logoutText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "600"
  },

  activeItem: {
    backgroundColor: "rgba(139,92,246,0.08)",
    borderRadius: 10
  }

});