import FullScreenLoader from "@/components/FullScreenLoader";
import { styles } from "@/screens/feature-compo/Withdrawal.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type BankAccount = {
    id: string;
    bankName: string;
    maskedNumber: string;
    accountHolder: string;
    ifsc: string;
    isPrimary: boolean;
};

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

const mockBankAccount: BankAccount = {
    id: "kotak-primary",
    bankName: "Kotak Mahindra Bank",
    maskedNumber: "****0378",
    accountHolder: "Arpit Sharma",
    ifsc: "KKBK0000876",
    isPrimary: true
};

export default function Withdrawal() {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [toast, setToast] = useState("");
    const [loading, setLoading] = useState(false);

    const availableBalance = 24850;
    const minimumWithdrawal = 500;
    const maximumWithdrawal = 50000;

    // Switch this to null later to preview the empty bank-account state.
    const bankAccount: BankAccount | null = mockBankAccount;

    const [selectedBankId, setSelectedBankId] = useState<string | null>(
        bankAccount?.id ?? null
    );

    const numericAmount = Number(amount || 0);
    const hasBankAccount = Boolean(bankAccount);
    const isValidAmount =
        numericAmount >= minimumWithdrawal &&
        numericAmount <= maximumWithdrawal &&
        numericAmount <= availableBalance;

    const canSubmit = Boolean(
        amount &&
        hasBankAccount &&
        selectedBankId &&
        isValidAmount
    );

    const handleQuickAmount = (value: number) => {
        setAmount(String(value));
    };

    const handleRequestWithdrawal = async () => {
        if (!canSubmit) {
            return;
        }

        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setToast("Withdrawal request submitted");
        } finally {
            setLoading(false);
            setTimeout(() => setToast(""), 2000);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {loading && <FullScreenLoader />}

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
                        onChangeText={setAmount}
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

                    {hasBankAccount && bankAccount ? (
                        <TouchableOpacity
                            style={[
                                styles.bankCard,
                                selectedBankId === bankAccount.id &&
                                    styles.bankCardSelected
                            ]}
                            onPress={() => setSelectedBankId(bankAccount.id)}
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
                                    {bankAccount.bankName}
                                </Text>
                                <Text style={styles.bankMeta}>
                                    {bankAccount.maskedNumber} • {bankAccount.ifsc}
                                </Text>
                            </View>

                            {bankAccount.isPrimary ? (
                                <View style={styles.bankTag}>
                                    <Text style={styles.bankTagText}>Primary</Text>
                                </View>
                            ) : null}
                        </TouchableOpacity>
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

                            <TouchableOpacity style={styles.addBankBtn}>
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
                            {bankAccount?.accountHolder ?? "Not available"}
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
                        onPress={handleRequestWithdrawal}
                    >
                        <Text style={styles.submitText}>Request Withdrawal</Text>
                        <Ionicons
                            name="arrow-forward"
                            size={18}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {toast !== "" ? (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>{toast}</Text>
                </View>
            ) : null}
        </SafeAreaView>
    );
}
