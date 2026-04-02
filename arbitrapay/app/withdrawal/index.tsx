import FullScreenLoader from "@/components/FullScreenLoader";
import TelegramRequiredModal from "@/components/TelegramRequiredModal";
import { useTelegramEnforcement } from "@/hooks/useTelegramEnforcement";
import { useWithdrawals } from "@/hooks/useWithdrawals";
import { styles } from "@/screens/feature-compo/Withdrawal.styles";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

function maskAccountNumber(accountNumber: string) {
    return `****${accountNumber.slice(-4)}`;
}

export default function Withdrawal() {
    const router = useRouter();
    const {
        telegramPromptVisible,
        showTelegramPrompt,
        closeTelegramPrompt,
    } = useTelegramEnforcement();
    const {
        loading,
        submitting,
        updatingPrimary,
        toast,
        amount,
        setAmount,
        accounts,
        selectedBankId,
        selectedAccount,
        availableBalance,
        minimumWithdrawal,
        maximumWithdrawal,
        isValidAmount,
        selectBankAccount,
        submitWithdrawal,
    } = useWithdrawals();

    const canSubmit = Boolean(
        amount &&
        accounts.length > 0 &&
        selectedBankId &&
        isValidAmount &&
        !submitting &&
        !updatingPrimary
    );

    const handleQuickAmount = (value: number) => {
        setAmount(String(value));
    };

    const handleAddBankAccount = () => {
        if (showTelegramPrompt()) {
            return;
        }

        router.push("/bank-account" as Href);
    };

    const handleSubmitWithdrawal = () => {
        if (showTelegramPrompt()) {
            return;
        }

        void submitWithdrawal();
    };

    if (loading) {
        return <FullScreenLoader />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Withdrawal</Text>
                </View>

                <View style={styles.walletCard}>
                    <Text style={styles.walletLabel}>READY TO WITHDRAW</Text>

                    <View style={styles.balanceBox}>
                        <Text style={styles.balanceLabel}>Available Balance</Text>
                        <Text style={styles.balanceAmount}>
                            ₹{availableBalance.toLocaleString("en-IN")}
                        </Text>
                    </View>

                    <View style={styles.walletMeta}>
                        <View>
                            <Text style={styles.metaLabel}>Settlement Window</Text>
                            <Text style={styles.metaValue}>Within 24 hours</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Withdrawal Details</Text>

                    <Text style={styles.sectionDesc}>
                        Enter an amount and choose the bank account where funds
                        should be sent.
                    </Text>

                    <Text style={styles.inputLabel}>Amount (₹)</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter withdrawal amount"
                        placeholderTextColor="#6B7280"
                        keyboardType="numeric"
                        value={amount}
                        editable={!submitting}
                        onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
                    />

                    <View style={styles.quickRow}>
                        {quickAmounts.map((value) => {
                            const active = amount === String(value);

                            return (
                                <TouchableOpacity
                                    key={value}
                                    style={[
                                        styles.quickBtn,
                                        active && styles.quickBtnActive
                                    ]}
                                    onPress={() => handleQuickAmount(value)}
                                    disabled={submitting}
                                >
                                    <Text
                                        style={[
                                            styles.quickText,
                                            active && styles.quickTextActive
                                        ]}
                                    >
                                        ₹{value.toLocaleString("en-IN")}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text style={styles.limitText}>
                        Minimum ₹{minimumWithdrawal.toLocaleString("en-IN")} •
                        Maximum ₹{maximumWithdrawal.toLocaleString("en-IN")}
                    </Text>

                    <Text style={styles.inputLabel}>Select Bank Account</Text>

                    {accounts.length > 0 ? (
                        accounts.map((bankAccount) => (
                            <TouchableOpacity
                                key={bankAccount.id}
                                style={[
                                    styles.bankCard,
                                    selectedBankId === bankAccount.id &&
                                    styles.bankCardSelected
                                ]}
                                onPress={() => selectBankAccount(bankAccount.id)}
                                disabled={submitting || Boolean(updatingPrimary)}
                            >
                                <View style={styles.radioOuter}>
                                    {selectedBankId === bankAccount.id ? (
                                        <View style={styles.radioInner} />
                                    ) : null}
                                </View>

                                <View style={styles.bankIconWrap}>
                                    <Ionicons
                                        name="business-outline"
                                        size={22}
                                        color="#8EA2FF"
                                    />
                                </View>

                                <View style={styles.bankDetails}>
                                    <Text style={styles.bankName}>
                                        {bankAccount.bank_name}
                                    </Text>
                                    <Text style={styles.bankMeta}>
                                        {maskAccountNumber(bankAccount.account_number)} • {bankAccount.ifsc_code}
                                    </Text>
                                </View>

                                {updatingPrimary === bankAccount.id ? (
                                    <ActivityIndicator size="small" color="#8EA2FF" />
                                ) : bankAccount.is_default ? (
                                    <View style={styles.bankTag}>
                                        <Text style={styles.bankTagText}>Primary</Text>
                                    </View>
                                ) : null}
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyBankBox}>
                            <Ionicons
                                name="file-tray-outline"
                                size={34}
                                color="#8EA2FF"
                            />

                            <Text style={styles.emptyBankTitle}>
                                No bank account added
                            </Text>

                            <Text style={styles.emptyBankText}>
                                Add a bank account to start withdrawing funds from
                                your ArbitraPay wallet.
                            </Text>

                            <TouchableOpacity
                                style={styles.addBankBtn}
                                onPress={handleAddBankAccount}
                            >
                                <Ionicons
                                    name="add-outline"
                                    size={18}
                                    color="#fff"
                                />
                                <Text style={styles.addBankText}>
                                    Add Bank Account
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.helperRow}>
                        <Text style={styles.helperLabel}>Selected Holder</Text>
                        <Text style={styles.helperValue}>
                            {selectedAccount?.account_holder_name ?? "Not available"}
                        </Text>
                    </View>

                    <View style={styles.helperRow}>
                        <Text style={styles.helperLabel}>Withdrawable Now</Text>
                        <Text style={styles.helperValue}>
                            ₹{availableBalance.toLocaleString("en-IN")}
                        </Text>
                    </View>

                    <View style={styles.infoBox}>
                        <View style={styles.infoIcon}>
                            <Ionicons
                                name="time-outline"
                                size={18}
                                color="#34D399"
                            />
                        </View>

                        <View style={styles.infoContent}>
                            <Text style={styles.infoTitle}>Processing Time</Text>
                            <Text style={styles.infoText}>
                                Withdrawals are usually processed within 24 hours
                                during business days.
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.submitBtn,
                            !canSubmit && styles.submitDisabled
                        ]}
                        disabled={!canSubmit}
                        onPress={handleSubmitWithdrawal}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.submitText}>Request Withdrawal</Text>
                                <Ionicons
                                    name="arrow-forward"
                                    size={18}
                                    color="#fff"
                                />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {toast !== "" ? (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>{toast}</Text>
                </View>
            ) : null}

            <TelegramRequiredModal
                visible={telegramPromptVisible}
                onClose={closeTelegramPrompt}
            />
        </SafeAreaView>
    );
}
