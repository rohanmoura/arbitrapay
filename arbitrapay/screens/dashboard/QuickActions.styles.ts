import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    marginTop: 0,
    paddingBottom: 20
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },

  actionBtn: {
    width: "48%",
    backgroundColor: "#111827",
    alignItems: "center",
    marginBottom: 14,
    borderRadius: 18,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: "#1F2937"
  },

  actionBtnWide: {
    width: "100%",
  },

  metricBtn: {
    backgroundColor: "#0D1A26",
    borderColor: "#164E63",
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#0B1220",
    borderColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },

  label: {
    color: "#E5E7EB",
    fontSize: 14,
    fontWeight: "500"
  },

  metricValue: {
    color: "#67E8F9",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  }

});
