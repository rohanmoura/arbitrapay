import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: "#0B1220"
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 20
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 28
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20
  },

  sectionTitle: {
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 6
  },

  sectionDesc: {
    color: "#6B7280",
    fontSize: 12,
    marginBottom: 14
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20
  },

  rowTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600"
  },

  rowDesc: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 2
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12
  },

  input: {
    flex: 1,
    backgroundColor: "#0B1220",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#1F2937"
  },

  refreshBtn: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center"
  },

  refreshText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600"
  },

  permissionStatus: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 18
  },

  versionText: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4
  }

});
