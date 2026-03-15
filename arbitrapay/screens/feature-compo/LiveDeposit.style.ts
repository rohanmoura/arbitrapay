import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: "#0B1220"
    },

    container: {
        padding: 20
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12
    },

    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#151A2E",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700"
    },

    pageDesc: {
        color: "#94A3B8",
        marginBottom: 22
    },

    /* Activation Card */

    activationCard: {
        backgroundColor: "#151A2E",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#1F2937"
    },

    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#8B5CF620",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14
    },

    activationTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 6
    },

    activationDesc: {
        textAlign: "center",
        color: "#94A3B8",
        lineHeight: 20,
        marginBottom: 20
    },

    activateBtn: {
        backgroundColor: "#8B5CF6",
        paddingVertical: 12,
        paddingHorizontal: 26,
        borderRadius: 12
    },

    activateText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15
    },

    /* Instruction Card */

    infoCard: {
        backgroundColor: "#0F172A",
        borderRadius: 18,
        padding: 20,
        borderWidth: 1,
        borderColor: "#1F2937"
    },

    infoTitle: {
        fontWeight: "700",
        fontSize: 16,
        marginBottom: 14,
        color: "#E5E7EB"
    },

    stepRow: {
        flexDirection: "row",
        marginBottom: 12
    },

    stepNumber: {
        color: "#8B5CF6",
        fontWeight: "700",
        marginRight: 8
    },

    stepText: {
        flex: 1,
        color: "#9CA3AF",
        lineHeight: 20
    },

    /* STATUS BADGE */

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: "#1F2937",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12
    },

    statusText: {
        color: "#F59E0B",
        fontSize: 12,
        marginLeft: 6,
        fontWeight: "600"
    },


    /* LOCK NOTICE */

    lockCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0F172A",
        borderRadius: 12,
        padding: 14,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#1F2937"
    },

    lockText: {
        flex: 1,
        color: "#9CA3AF",
        marginLeft: 8,
        fontSize: 13,
        lineHeight: 18
    },

    liveHeroCard: {
        backgroundColor: "#151A2E",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#1F2937",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12
    },

    liveHeroLabel: {
        color: "#7C8DB5",
        fontSize: 12,
        letterSpacing: 1
    },

    liveHeroTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        marginTop: 6
    },

    liveHeroDesc: {
        color: "#94A3B8",
        fontSize: 13,
        marginTop: 8,
        lineHeight: 20,
        maxWidth: 240
    },

    liveHeroBadge: {
        position: "absolute",
        top: 10,
        right: 5,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 6,
        backgroundColor: "#0F172A",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6
    },

    liveHeroBadgeText: {
        color: "#22C55E",
        fontSize: 12,
        fontWeight: "700"
    },

    selectorCard: {
        backgroundColor: "#0F172A",
        borderRadius: 18,
        padding: 16,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#1F2937"
    },

    selectorLabel: {
        color: "#E5E7EB",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 12
    },

    selectorScroll: {
        gap: 10,
        paddingRight: 4
    },

    selectorChip: {
        minWidth: 150,
        backgroundColor: "#151A2E",
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "#26314E"
    },

    selectorChipActive: {
        backgroundColor: "#8B5CF6",
        borderColor: "#8B5CF6"
    },

    selectorChipBank: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600"
    },

    selectorChipBankActive: {
        color: "#fff"
    },

    selectorChipAccount: {
        color: "#9CA3AF",
        fontSize: 12,
        marginTop: 4
    },

    selectorChipAccountActive: {
        color: "#E9D5FF"
    },

    liveListCard: {
        backgroundColor: "#151A2E",
        borderRadius: 22,
        padding: 18,
        borderWidth: 1,
        borderColor: "#1F2937"
    },

    selectedAccountHeader: {
        marginBottom: 16
    },

    selectedAccountBank: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700"
    },

    selectedAccountMeta: {
        color: "#94A3B8",
        fontSize: 13,
        marginTop: 4
    },

    emptyLiveState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 44,
        paddingHorizontal: 16
    },

    emptyLiveTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 14
    },

    emptyLiveDesc: {
        color: "#94A3B8",
        textAlign: "center",
        marginTop: 8,
        lineHeight: 20
    },

    depositItem: {
        flexDirection: "row",
        gap: 12,
        backgroundColor: "#0F172A",
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "#1F2937",
        marginBottom: 12
    },

    depositIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#151A2E",
        justifyContent: "center",
        alignItems: "center"
    },

    depositBody: {
        flex: 1
    },

    depositTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10
    },

    depositBankName: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
        flex: 1
    },

    depositAmount: {
        fontSize: 15,
        fontWeight: "700"
    },

    depositMetaRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 6
    },

    depositMeta: {
        color: "#94A3B8",
        fontSize: 12,
        marginTop: 4
    },

    depositBottomRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
        gap: 10
    },

    depositTime: {
        color: "#CBD5E1",
        fontSize: 12,
        flex: 1
    },

    depositType: {
        fontSize: 11,
        fontWeight: "700",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        overflow: "hidden"
    },

});
