import FullScreenLoader from "@/components/FullScreenLoader";
import { styles } from "@/screens/feature-compo/BankAccount.style";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type BankAccount = {
    id: string;
    holder: string;
    bank: string;
    accountNumber: string;
    ifsc: string;
    isPrimary: boolean;
};

export default function BankAccounts() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [accounts, setAccounts] = useState<BankAccount[]>([]);

    const [holder, setHolder] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [bank, setBank] = useState("");
    const [showAccount, setShowAccount] = useState<string | null>(null);
    const holderRef = useRef<TextInput>(null);
    const [errors, setErrors] = useState({
        holder: "",
        accountNumber: "",
        ifsc: "",
        bank: ""
    });

    const handleAddAccount = async () => {

        const newErrors: any = {};

        if (!holder) newErrors.holder = "Account holder name is required";
        if (accountNumber.length < 10) newErrors.accountNumber = "Account number must be 10 digits";
        if (ifsc.length !== 11) newErrors.ifsc = "Invalid IFSC code";
        if (!bank) newErrors.bank = "Bank name required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 600));

        const newAccount: BankAccount = {
            id: Date.now().toString(),
            holder,
            accountNumber,
            ifsc,
            bank,
            isPrimary: accounts.length === 0
        };

        setAccounts([...accounts, newAccount]);

        setHolder("");
        setAccountNumber("");
        setIfsc("");
        setBank("");

        setModalVisible(false);

        setToast("Bank account added");

        setTimeout(() => setToast(""), 2000);

        setLoading(false);

    };

    const removeAccount = (id: string) => {

        const updated = accounts.filter(a => a.id !== id);

        if (updated.length > 0 && !updated.some(a => a.isPrimary)) {
            updated[0].isPrimary = true;
        }

        setAccounts(updated);

    };

    const handleDelete = (id: string) => {

        Alert.alert(
            "Delete Bank Account",
            "Are you sure you want to remove this bank account?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => removeAccount(id)
                }
            ]
        );

    };

    const setPrimary = (id: string) => {

        const updated = accounts.map(acc => ({
            ...acc,
            isPrimary: acc.id === id
        }));

        setAccounts(updated);

    };

    return (

        <SafeAreaView style={styles.safeArea}>

            {loading && <FullScreenLoader />}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Bank Accounts
                    </Text>

                </View>


                <View style={styles.topCard}>

                    <Text style={styles.topLabel}>
                        BANKING
                    </Text>

                    <Text style={styles.topTitle}>
                        Manage Withdrawal Accounts
                    </Text>

                    <Text style={styles.topDesc}>
                        Add and manage bank accounts used for withdrawals.
                    </Text>

                    <TouchableOpacity
                        style={styles.addTopBtn}
                        onPress={() => {
                            setModalVisible(true);
                            setTimeout(() => holderRef.current?.focus(), 200);
                        }}
                    >

                        <Ionicons name="add" size={18} color="#fff" />

                        <Text style={styles.addTopText}>
                            Add Account
                        </Text>

                    </TouchableOpacity>

                </View>


                <View style={styles.card}>

                    {accounts.length === 0 && (

                        <View style={styles.emptyBox}>

                            <View style={styles.emptyIcon}>
                                <Ionicons name="card-outline" size={28} color="#8EA2FF" />
                            </View>

                            <Text style={styles.emptyTitle}>
                                No Bank Accounts
                            </Text>

                            <Text style={styles.emptyDesc}>
                                Add a bank account to start withdrawing funds from your wallet.
                            </Text>

                            <TouchableOpacity
                                style={styles.addBtn}
                                onPress={() => {
                                    setModalVisible(true);
                                    setTimeout(() => holderRef.current?.focus(), 200);
                                }}
                            >

                                <Ionicons name="add" size={18} color="#fff" />

                                <Text style={styles.addBtnText}>
                                    Add Your First Account
                                </Text>

                            </TouchableOpacity>

                        </View>

                    )}


                    {accounts.map(account => (

                        <TouchableOpacity
                            key={account.id}
                            style={[
                                styles.bankCard,
                                account.isPrimary && styles.bankCardSelected
                            ]}
                            onPress={() => setPrimary(account.id)}
                            activeOpacity={0.85}
                        >

                            <View style={styles.bankIcon}>
                                <Ionicons name="business-outline" size={22} color="#8EA2FF" />
                            </View>

                            <View style={{ flex: 1 }}>

                                <View style={styles.bankRow}>
                                    <Text style={styles.bankName}>
                                        {account.bank}
                                    </Text>

                                    <View style={{ flex: 1 }} />

                                    {account.isPrimary && (
                                        <View style={styles.primaryTag}>
                                            <Text style={styles.primaryText}>
                                                Primary
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <Text style={styles.bankHolder}>
                                    {account.holder}
                                </Text>

                                <View style={styles.accountRow}>

                                    <Text style={styles.bankMeta}>
                                        A/C {showAccount === account.id
                                            ? account.accountNumber
                                            : `****${account.accountNumber.slice(-4)}`}
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() =>
                                            setShowAccount(
                                                showAccount === account.id ? null : account.id
                                            )
                                        }
                                    >
                                        <Ionicons
                                            name={showAccount === account.id ? "eye-off-outline" : "eye-outline"}
                                            size={16}
                                            color="#94A3B8"
                                        />
                                    </TouchableOpacity>

                                </View>

                                <Text style={styles.bankMeta}>
                                    IFSC {account.ifsc}
                                </Text>

                                <View style={styles.bankActions}>

                                    {!account.isPrimary && (

                                        <TouchableOpacity
                                            style={styles.primaryBtn}
                                            onPress={() => setPrimary(account.id)}
                                        >

                                            <Text style={styles.primaryBtnText}>
                                                Make Primary
                                            </Text>

                                        </TouchableOpacity>

                                    )}

                                    <TouchableOpacity
                                        style={styles.deleteBtn}
                                        onPress={() => handleDelete(account.id)}
                                    >

                                        <Ionicons name="trash-outline" size={16} color="#EF4444" />

                                        <Text style={styles.deleteText}>
                                            Delete
                                        </Text>

                                    </TouchableOpacity>

                                </View>

                            </View>

                        </TouchableOpacity>

                    ))}

                    <View style={styles.infoBox}>

                        <View style={styles.infoIcon}>
                            <Ionicons name="alert-circle-outline" size={18} color="#FBBF24" />
                        </View>

                        <View style={{ flex: 1 }}>

                            <Text style={styles.infoTitle}>
                                Important Information
                            </Text>

                            <Text style={styles.infoText}>
                                • Ensure bank details are correct to avoid withdrawal delays.
                            </Text>

                            <Text style={styles.infoText}>
                                • Primary account will be used by default for withdrawals.
                            </Text>

                            <Text style={styles.infoText}>
                                • Account holder name must match your registered name.
                            </Text>

                        </View>

                    </View>

                </View>

            </ScrollView>


            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
            >

                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ width: "100%" }} >

                        <View style={styles.modalCard}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled">

                                <View style={styles.modalHeader}>

                                    <Text style={styles.modalTitle}>
                                        Add Bank Account
                                    </Text>

                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <Ionicons name="close" size={22} color="#fff" />
                                    </TouchableOpacity>

                                </View>

                                <Text style={styles.modalDesc}>
                                    Enter your bank details for withdrawals
                                </Text>

                                <Text style={styles.inputLabel}>
                                    Account Holder Name <Text style={styles.required}>*</Text>
                                </Text>

                                <TextInput
                                    ref={holderRef}
                                    style={styles.input}
                                    placeholder="Enter name as per bank"
                                    placeholderTextColor="#6B7280"
                                    value={holder}
                                    autoCapitalize="words"
                                    returnKeyType="next"
                                    onChangeText={(text) => {
                                        setHolder(text);
                                        setErrors(prev => ({ ...prev, holder: "" }));
                                    }}
                                />
                                {errors.holder ? (
                                    <Text style={styles.errorText}>{errors.holder}</Text>
                                ) : null}

                                <Text style={styles.inputLabel}>
                                    Account Number <Text style={styles.required}>*</Text>
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    keyboardType="number-pad"
                                    placeholder="Enter account number"
                                    placeholderTextColor="#6B7280"
                                    value={accountNumber}
                                    maxLength={10}
                                    onChangeText={(text) => {
                                        const digits = text.replace(/[^0-9]/g, "");
                                        setAccountNumber(digits);
                                        setErrors(prev => ({ ...prev, accountNumber: "" }));
                                    }}
                                />
                                {errors.accountNumber ? (
                                    <Text style={styles.errorText}>{errors.accountNumber}</Text>
                                ) : null}

                                <Text style={styles.inputLabel}>
                                    IFSC Code <Text style={styles.required}>*</Text>
                                </Text>



                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter IFSC Code"
                                    placeholderTextColor="#6B7280"
                                    value={ifsc}
                                    autoCapitalize="characters"
                                    maxLength={11}
                                    onChangeText={(text) => {
                                        const clean = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                                        setIfsc(clean);
                                        setErrors(prev => ({ ...prev, ifsc: "" }));
                                    }}
                                />
                                {errors.ifsc ? (
                                    <Text style={styles.errorText}>{errors.ifsc}</Text>
                                ) : null}

                                <Text style={styles.inputLabel}>
                                    Bank Name <Text style={styles.required}>*</Text>
                                </Text>
                                <Text style={styles.helperText}>
                                    Enter your bank name manually
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Auto detected from IFSC"
                                    placeholderTextColor="#6B7280"
                                    value={bank}
                                    autoCapitalize="words"
                                    editable={true}
                                    onChangeText={(text) => {
                                        setBank(text);
                                        setErrors(prev => ({ ...prev, bank: "" }));
                                    }}
                                />
                                {errors.bank ? (
                                    <Text style={styles.errorText}>{errors.bank}</Text>
                                ) : null}

                                <TouchableOpacity
                                    style={[
                                        styles.submitBtn,
                                        (!holder || accountNumber.length < 10 || ifsc.length < 11 || !bank) && styles.submitDisabled
                                    ]}
                                    disabled={!holder || accountNumber.length < 10 || ifsc.length < 11 || !bank}
                                    onPress={handleAddAccount}
                                >

                                    <Text style={styles.submitText}>
                                        Add Account
                                    </Text>

                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>

                </View>

            </Modal>


            {toast !== "" && (

                <View style={styles.toast}>
                    <Text style={styles.toastText}>
                        {toast}
                    </Text>
                </View>

            )}

        </SafeAreaView>

    );

}