import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#08101D",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#131B2D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  heroCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    backgroundColor: "#101A2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  heroLabel: {
    color: "#7F97C0",
    fontSize: 12,
    letterSpacing: 1,
  },

  heroTitle: {
    color: "#F8FAFC",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 8,
  },

  heroSubTitle: {
    color: "#9FB3D9",
    fontSize: 13,
    marginTop: 6,
  },

  walletMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  metaLabel: {
    color: "#6E84AF",
    fontSize: 11,
  },

  metaValue: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },

  telegramBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2B3B60",
    backgroundColor: "#121D33",
  },

  telegramText: {
    color: "#8BC3FF",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#101A2E",
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },

  sectionDesc: {
    color: "#9FB3D9",
    fontSize: 13,
    marginBottom: 14,
  },

  walletBox: {
    marginTop: 8,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#0B1424",
    borderWidth: 1,
    borderColor: "rgba(139,195,255,0.2)",
  },

  walletRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  walletTextWrap: {
    flex: 1,
  },

  walletLabel: {
    color: "#7FA3D8",
    fontSize: 12,
  },

  walletValue: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },

  copyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#14253D",
    justifyContent: "center",
    alignItems: "center",
  },

  rateList: {
    marginTop: 12,
    backgroundColor: "#0B1424",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  rateRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  rateRowLast: {
    borderBottomWidth: 0,
  },

  rateText: {
    color: "#D3E0F5",
    fontSize: 14,
    fontWeight: "600",
  },

  inputLabel: {
    color: "#F8FAFC",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#284064",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#fff",
    marginBottom: 10,
    backgroundColor: "#0B1424",
  },

  errorText: {
    color: "#F87171",
    fontSize: 12,
    marginTop: -6,
    marginBottom: 8,
  },

  uploadBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#3C5F8B",
    borderRadius: 18,
    paddingVertical: 28,
    alignItems: "center",
    backgroundColor: "#0B1424",
    marginBottom: 16,
    overflow: "hidden",
  },

  uploadText: {
    color: "#E2E8F0",
    fontWeight: "600",
    marginTop: 8,
  },

  uploadSub: {
    color: "#8CA2C7",
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  previewImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
  },

  uploadChange: {
    color: "#8BC3FF",
    fontSize: 13,
    fontWeight: "600",
  },

  infoBox: {
    backgroundColor: "#142033",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#22D3EE",
  },

  infoTitle: {
    color: "#B8EEFF",
    fontWeight: "700",
    marginBottom: 6,
  },

  infoText: {
    color: "#AFC4E9",
    fontSize: 13,
    lineHeight: 20,
  },

  submitBtn: {
    backgroundColor: "#22D3EE",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  submitDisabled: {
    opacity: 0.5,
  },

  submitText: {
    color: "#062132",
    fontSize: 16,
    fontWeight: "800",
  },

  toast: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#12314A",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2C4D6B",
  },

  toastText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "500",
  },
});
