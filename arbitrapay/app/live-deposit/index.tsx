import FullScreenLoader from "@/components/FullScreenLoader";
import { useLiveDeposits } from "@/hooks/useLiveDeposits";
import { styles } from "@/screens/feature-compo/LiveDeposit.style";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function maskAccountNumber(accountNumber: string, visible: boolean) {
    if (visible) {
        return accountNumber;
    }

    return `******${accountNumber.slice(-4)}`;
}

function formatDepositTime(timestamp: string | null) {
    if (!timestamp) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
        .format(new Date(timestamp))
        .replace(",", " •");
}

export default function LiveDepositLocked() {

    const router = useRouter();
    const {
        loading,
        accounts,
        selectedBankAccountId,
        deposits,
        visibleDepositId,
        setVisibleDepositId,
        selectAccount,
    } = useLiveDeposits();

    const selectedAccount =
        accounts.find((account) => account.bankAccountId === selectedBankAccountId) ||
        accounts[0] ||
        null;

    if (loading) {
        return <FullScreenLoader />;
    }

    return (

        <SafeAreaView style={styles.safeArea}>

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Live Deposits
                    </Text>

                </View>

                <Text style={styles.pageDesc}>
                    Real-time deposit tracking
                </Text>

                {accounts.length === 0 ? (
                    <>

                        <View style={styles.statusBadge}>
                            <Ionicons name="alert-circle-outline" size={14} color="#F59E0B" />
                            <Text style={styles.statusText}>
                                Activation Required
                            </Text>
                        </View>


                        <View style={styles.lockCard}>

                            <Ionicons
                                name="lock-closed-outline"
                                size={18}
                                color="#22C55E"
                            />

                            <Text style={styles.lockText}>
                                Deposits are locked until your account is activated.
                            </Text>

                        </View>

                        <View style={styles.activationCard}>

                            <View style={styles.iconCircle}>
                                <Ionicons name="sparkles-outline" size={28} color="#fff" />
                            </View>

                            <Text style={styles.activationTitle}>
                                Account Not Activated
                            </Text>

                            <Text style={styles.activationDesc}>
                                Submit activation request with your bank details
                                to start receiving live deposits
                            </Text>

                            <TouchableOpacity
                                style={styles.activateBtn}
                                onPress={() => router.push("/account-activation" as Href)}
                            >

                                <Text style={styles.activateText}>
                                    Go to Account Activation
                                </Text>

                            </TouchableOpacity>

                        </View>

                        <View style={styles.infoCard}>

                            <Text style={styles.infoTitle}>
                                How to activate:
                            </Text>

                            <View style={styles.stepRow}>
                                <Text style={styles.stepNumber}>1.</Text>
                                <Text style={styles.stepText}>
                                    Go to &quot;Account Activation&quot; page from sidebar
                                </Text>
                            </View>

                            <View style={styles.stepRow}>
                                <Text style={styles.stepNumber}>2.</Text>
                                <Text style={styles.stepText}>
                                    Fill all your bank and card details
                                </Text>
                            </View>

                            <View style={styles.stepRow}>
                                <Text style={styles.stepNumber}>3.</Text>
                                <Text style={styles.stepText}>
                                    Submit for admin approval
                                </Text>
                            </View>

                            <View style={styles.stepRow}>
                                <Text style={styles.stepNumber}>4.</Text>
                                <Text style={styles.stepText}>
                                    Once approved, live deposits will start automatically
                                </Text>
                            </View>

                        </View>

                    </>
                ) : (
                    <>

                        <View style={styles.liveHeroCard}>
                            <View>
                                <Text style={styles.liveHeroLabel}>LIVE ACCESS</Text>
                                <Text style={styles.liveHeroTitle}>Approved Deposit Accounts</Text>
                                <Text style={styles.liveHeroDesc}>
                                    Track admin-added live deposits for your activated bank accounts.
                                </Text>
                            </View>

                            <View style={styles.liveHeroBadge}>
                                <Ionicons name="radio-outline" size={15} color="#22C55E" />
                                <Text style={styles.liveHeroBadgeText}>Active</Text>
                            </View>
                        </View>

                        <View style={styles.selectorCard}>
                            <Text style={styles.selectorLabel}>Select Account</Text>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.selectorScroll}
                            >
                                {accounts.map((account) => {
                                    const selected = account.bankAccountId === selectedBankAccountId;

                                    return (
                                        <TouchableOpacity
                                            key={account.bankAccountId}
                                            style={[
                                                styles.selectorChip,
                                                selected && styles.selectorChipActive
                                            ]}
                                            onPress={() => selectAccount(account.bankAccountId)}
                                        >
                                            <Text
                                                style={[
                                                    styles.selectorChipBank,
                                                    selected && styles.selectorChipBankActive
                                                ]}
                                            >
                                                {account.bankName}
                                            </Text>

                                            <Text
                                                style={[
                                                    styles.selectorChipAccount,
                                                    selected && styles.selectorChipAccountActive
                                                ]}
                                            >
                                                A/C ******{account.accountNumber.slice(-4)}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        <View style={styles.liveListCard}>
                            {selectedAccount && (
                                <View style={styles.selectedAccountHeader}>
                                    <View>
                                        <Text style={styles.selectedAccountBank}>
                                            {selectedAccount.bankName}
                                        </Text>
                                        <Text style={styles.selectedAccountMeta}>
                                            {selectedAccount.accountHolderName} • IFSC {selectedAccount.ifscCode}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {deposits.length === 0 ? (
                                <View style={styles.emptyLiveState}>
                                    <Ionicons name="wallet-outline" size={34} color="#8B5CF6" />
                                    <Text style={styles.emptyLiveTitle}>
                                        {selectedAccount
                                            ? "No live deposits have been recorded for this account."
                                            : "No live deposits have been recorded for your active account yet."}
                                    </Text>
                                    <Text style={styles.emptyLiveDesc}>
                                        Deposits added by the admin panel will appear here in real time.
                                    </Text>
                                </View>
                            ) : (
                                deposits.map((deposit) => {
                                    const isVisible = visibleDepositId === deposit.id;
                                    const normalizedType = deposit.type?.toLowerCase() === "debit" ? "debit" : "credit";
                                    const amountColor = normalizedType === "credit" ? "#22C55E" : "#EF4444";
                                    const amountPrefix = normalizedType === "credit" ? "+" : "-";

                                    return (
                                        <View key={deposit.id} style={styles.depositItem}>
                                            <View style={styles.depositIcon}>
                                                <Ionicons
                                                    name={normalizedType === "credit" ? "arrow-down-outline" : "arrow-up-outline"}
                                                    size={18}
                                                    color={amountColor}
                                                />
                                            </View>

                                            <View style={styles.depositBody}>
                                                <View style={styles.depositTopRow}>
                                                    <Text style={styles.depositBankName}>
                                                        {selectedAccount?.bankName || "Bank Account"}
                                                    </Text>
                                                    <Text style={[styles.depositAmount, { color: amountColor }]}>
                                                        {amountPrefix}₹{Number(deposit.amount).toLocaleString("en-IN")}
                                                    </Text>
                                                </View>

                                                <View style={styles.depositMetaRow}>
                                                    <Text style={styles.depositMeta}>
                                                        A/C {maskAccountNumber(
                                                            selectedAccount?.accountNumber || "",
                                                            isVisible
                                                        )}
                                                    </Text>

                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            setVisibleDepositId(isVisible ? null : deposit.id)
                                                        }
                                                    >
                                                        <Ionicons
                                                            name={isVisible ? "eye-off-outline" : "eye-outline"}
                                                            size={16}
                                                            color="#94A3B8"
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                                <Text style={styles.depositMeta}>
                                                    IFSC {selectedAccount?.ifscCode || "—"}
                                                </Text>

                                                <View style={styles.depositBottomRow}>
                                                    <Text style={styles.depositTime}>
                                                        {formatDepositTime(deposit.created_at)}
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            styles.depositType,
                                                            {
                                                                color: amountColor,
                                                                backgroundColor:
                                                                    normalizedType === "credit"
                                                                        ? "rgba(34,197,94,0.14)"
                                                                        : "rgba(239,68,68,0.14)",
                                                            }
                                                        ]}
                                                    >
                                                        {normalizedType === "credit" ? "Credit" : "Debit"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </View>

                    </>
                )}

            </ScrollView>

        </SafeAreaView>

    );

}
