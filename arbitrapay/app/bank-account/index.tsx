import FullScreenLoader from "@/components/FullScreenLoader";
import { useBankAccounts } from "@/hooks/useBankAccounts";
import { styles } from "@/screens/feature-compo/BankAccount.style";
import { BankAccountRecord } from "@/services/bankAccountService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef } from "react";
import {
    ActivityIndicator,
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

export default function BankAccounts() {

    const router = useRouter();
    const holderRef = useRef<TextInput>(null);
    const {
        loading,
        submitting,
        modalVisible,
        toast,
        accounts,
        holder,
        accountNumber,
        ifsc,
        bank,
        errors,
        showAccount,
        deletingId,
        settingPrimaryId,
        setHolder,
        setAccountNumber,
        setIfsc,
        setBank,
        setErrors,
        setShowAccount,
        openModal,
        closeModal,
        submitAccount,
        confirmDelete,
        makePrimary,
    } = useBankAccounts();

    const openAddModal = () => {
        openModal();
        setTimeout(() => holderRef.current?.focus(), 200);
    };

    const isBusy = submitting || Boolean(deletingId) || Boolean(settingPrimaryId);

    const renderDeleteButton = (account: BankAccountRecord) => {
        const isDeleting = deletingId === account.id;

        return (
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => confirmDelete(account.id)}
                disabled={isBusy}
            >

                {isDeleting ? (
                    <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                    <>
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />

                        <Text style={styles.deleteText}>
                            Delete
                        </Text>
                    </>
                )}

            </TouchableOpacity>
        );
    };

    if (loading) {
        return <FullScreenLoader />;
    }

    return (

        <SafeAreaView style={styles.safeArea}>

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
                        onPress={openAddModal}
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
                                onPress={openAddModal}
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
                                account.is_default && styles.bankCardSelected
                            ]}
                            onPress={() => makePrimary(account.id)}
                            activeOpacity={0.85}
                            disabled={isBusy}
                        >

                            <View style={styles.bankIcon}>
                                <Ionicons name="business-outline" size={22} color="#8EA2FF" />
                            </View>

                            <View style={{ flex: 1 }}>

                                <View style={styles.bankRow}>
                                    <Text style={styles.bankName}>
                                        {account.bank_name}
                                    </Text>

                                    <View style={{ flex: 1 }} />

                                    {account.is_default && (
                                        <View style={styles.primaryTag}>
                                            <Text style={styles.primaryText}>
                                                Primary
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <Text style={styles.bankHolder}>
                                    {account.account_holder_name}
                                </Text>

                                <View style={styles.accountRow}>

                                    <Text style={styles.bankMeta}>
                                        A/C {showAccount === account.id
                                            ? account.account_number
                                            : `****${account.account_number.slice(-4)}`}
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() =>
                                            setShowAccount(
                                                showAccount === account.id ? null : account.id
                                            )
                                        }
                                        disabled={isBusy}
                                    >
                                        <Ionicons
                                            name={showAccount === account.id ? "eye-off-outline" : "eye-outline"}
                                            size={16}
                                            color="#94A3B8"
                                        />
                                    </TouchableOpacity>

                                </View>

                                <Text style={styles.bankMeta}>
                                    IFSC {account.ifsc_code}
                                </Text>

                                <View style={styles.bankActions}>

                                    {!account.is_default && (

                                        <TouchableOpacity
                                            style={styles.primaryBtn}
                                            onPress={() => makePrimary(account.id)}
                                            disabled={isBusy}
                                        >

                                            {settingPrimaryId === account.id ? (
                                                <ActivityIndicator size="small" color="#8EA2FF" />
                                            ) : (
                                                <Text style={styles.primaryBtnText}>
                                                    Make Primary
                                                </Text>
                                            )}

                                        </TouchableOpacity>

                                    )}

                                    {renderDeleteButton(account)}

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

                                    <TouchableOpacity onPress={closeModal} disabled={submitting}>
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
                                    editable={!submitting}
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
                                    maxLength={18}
                                    onChangeText={(text) => {
                                        const digits = text.replace(/[^0-9]/g, "");
                                        setAccountNumber(digits);
                                        setErrors(prev => ({ ...prev, accountNumber: "" }));
                                    }}
                                    editable={!submitting}
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
                                    editable={!submitting}
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
                                    editable={!submitting}
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
                                    disabled={!holder || accountNumber.length < 10 || ifsc.length < 11 || !bank || submitting}
                                    onPress={submitAccount}
                                >

                                    {submitting ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={styles.submitText}>
                                            Add Account
                                        </Text>
                                    )}

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
