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

    header: {
        flexDirection: "row",
        alignItems: "center"
    },

    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#151A2E",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },

    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700"
    },

    subtitle: {
        color: "#94A3B8",
        marginTop: 6,
        marginBottom: 24
    },

    /* summary */

    summaryWrap: {
        gap: 18,
        marginBottom: 26,
    },

    summaryCard: {
        backgroundColor: "#151A2E",
        borderRadius: 18,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6
    },

    summaryLabel: {
        color: "#94A3B8",
        marginBottom: 6
    },

    summaryValue: {
        fontSize: 28,
        fontWeight: "700"
    },

    /* filter */

    filterCard: {
        backgroundColor: "#151A2E",
        borderRadius: 18,
        padding: 16,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6
    },

    tabs: {
        flexDirection: "row",
        backgroundColor: "#020617",
        borderRadius: 12,
        padding: 4,
        marginBottom: 14
    },

    tabItem: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 8
    },

    tabActive: {
        backgroundColor: "#334155"
    },

    tabText: {
        color: "#94A3B8",
        fontWeight: "500"
    },

    tabTextActive: {
        color: "#fff",
        fontWeight: "600"
    },

    /* search */

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#020617",
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#1E293B"
    },

    searchInput: {
        flex: 1,
        paddingVertical: 12,
        color: "#fff",
        marginLeft: 8
    },

    /* empty */

    emptyCard: {
        backgroundColor: "#151A2E",
        borderRadius: 18,
        marginTop: 8,
        paddingVertical: 60,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6
    },

    emptyTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginTop: 12
    },

    emptyDesc: {
        color: "#94A3B8",
        marginTop: 6,
        textAlign: "center",
        paddingHorizontal: 30
    },

    summaryTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6
    },

});