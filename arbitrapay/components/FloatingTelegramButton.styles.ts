import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    position: "absolute",
    right: 16,
    bottom: 68,
    alignItems: "center"
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    opacity: 0.9
  },

  glow: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    top: -4,
    left: -4,
    opacity: 0.35
  },

  button: {
    width: 52,
    height: 52,
    borderRadius: 26,

    backgroundColor: "#229ED9",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#229ED9",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },

    elevation: 8
  },

  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain"
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -6,

    minWidth: 26,
    height: 16,
    paddingHorizontal: 4,

    borderRadius: 8,
    backgroundColor: "#FF3B3B",

    justifyContent: "center",
    alignItems: "center"
  },

  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700"
  }

});