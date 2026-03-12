import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: "#0B1220"
    },

    container: {
        padding: 20,
        paddingBottom: 40
    },

    modalBackdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },

    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#151A2E",
        alignItems: "center",
        justifyContent: "center"
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center"
    },

    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
        marginLeft: 12
    },

    ticketBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#8B5CF6",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 6
    },

    ticketBtnText: {
        color: "#fff",
        fontWeight: "600"
    },

    subtitle: {
        color: "#94A3B8",
        marginTop: 4,
        marginBottom: 20
    },

    telegramBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 24,
        gap: 10
    },

    telegramText: {
        color: "#fff",
        fontWeight: "600"
    },

    quickCard: {
        backgroundColor: "#151A2E",
        borderRadius: 16,
        padding: 20,
        marginBottom: 30
    },

    quickTitle: {
        color: "#fff",
        fontWeight: "600",
        marginBottom: 10
    },

    whatsappBox: {
        backgroundColor: "#1E293B",
        borderRadius: 12,
        padding: 16
    },

    whatsappLabel: {
        color: "#94A3B8"
    },

    whatsappAction: {
        color: "#fff",
        fontWeight: "600"
    },

    ticketCard: {
        backgroundColor: "#151A2E",
        borderRadius: 18,
        paddingVertical: 40,
        paddingHorizontal: 24,
        alignItems: "center",
        marginTop: 30
    },

    emptyTitle: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
        marginTop: 14
    },

    emptyDesc: {
        color: "#94A3B8",
        marginTop: 6,
        marginBottom: 20,
        textAlign: "center",
        lineHeight: 20
    },

    createTicketBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#8B5CF6",
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8
    },

    createTicketText: {
        color: "#fff",
        fontWeight: "600"
    },

    /* Modal */

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end"
    },

    modalCard: {
        backgroundColor: "#151A2E",
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        padding: 20,
        height: "92%"
    },

    modalHandle: {
        width: 46,
        height: 5,
        backgroundColor: "#334155",
        alignSelf: "center",
        borderRadius: 10,
        marginBottom: 14
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    modalTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700"
    },

    modalSubtitle: {
        color: "#94A3B8",
        marginTop: 4,
        marginBottom: 16
    },

    inputLabel: {
        color: "#CBD5F5",
        marginBottom: 8,
        marginTop: 18,
        fontWeight: "600"
    },

    input: {
        backgroundColor: "#020617",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        color: "#fff",
        borderWidth: 1,
        borderColor: "#1E293B",
        fontSize: 14
    },

    textArea: {
        backgroundColor: "#020617",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        color: "#fff",
        height: 120,
        textAlignVertical: "top",
        borderWidth: 1,
        borderColor: "#1E293B",
        fontSize: 14
    },

    submitBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#8B5CF6",
        paddingVertical: 16,
        borderRadius: 14,
        marginTop: 20,
        shadowColor: "#8B5CF6",
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
        gap: 8
    },

    responseTime: {
        color: "#64748B",
        textAlign: "center",
        marginTop: 8,
        fontSize: 12
    },

    submitText: {
        color: "#fff",
        fontWeight: "600"
    },

    categoryBox: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10
    },

    categoryItem: {
        backgroundColor: "#020617",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#1E293B"
    },

    categoryActive: {
        backgroundColor: "#8B5CF6",
        borderColor: "#8B5CF6"
    },

    categoryText: {
        color: "#94A3B8"
    },

    categoryTextActive: {
        color: "#fff",
        fontWeight: "600"
    }

})