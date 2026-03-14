import FullScreenLoader from "@/components/FullScreenLoader";
import { TELEGRAM_CHANNEL_URL } from "@/components/FloatingTelegramButton";
import { useSecurityDeposit } from "@/hooks/useSecurityDeposit";
import { styles } from "@/screens/feature-compo/SecurityDeposit.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SecurityDeposit() {

    const router = useRouter();
    const {
        loading,
        submitting,
        pickingScreenshot,
        amount,
        utr,
        method,
        screenshot,
        toast,
        copied,
        lastDeposit,
        errors,
        config,
        setAmount,
        setUtr,
        setMethod,
        setErrors,
        copyUpi,
        pickScreenshot,
        submitDeposit,
    } = useSecurityDeposit();

    const quickAmounts = ["5000", "10000", "20000", "50000"];

    const isValid =
        amount &&
        Number(amount) >= 5000 &&
        utr.trim().length > 0 &&
        Boolean(screenshot);

    const openTelegram = async () => {
        const supported = await Linking.canOpenURL(TELEGRAM_CHANNEL_URL);

        if (supported) {
            await Linking.openURL(TELEGRAM_CHANNEL_URL);
        }
    };

    if (loading) {
        return <FullScreenLoader />;
    }

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: "#0B1220" }}>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* HEADER */}

                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.replace("/")}
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Security Deposit</Text>

                </View>


                {/* WALLET CARD */}

                <View style={styles.walletCard}>

                    <Text style={styles.walletLabel}>ARBITRAPAY WALLET</Text>

                    <View style={styles.balanceBox}>
                        <Text style={styles.balanceLabel}>Current Balance</Text>
                        <Text style={styles.balanceAmount}>₹0</Text>
                    </View>

                    <View style={styles.walletMeta}>

                        <View>
                            <Text style={styles.metaLabel}>Last Deposit</Text>
                            <Text style={styles.metaValue}>{lastDeposit}</Text>
                        </View>

                        <View>
                            <Text style={styles.metaLabel}>Status</Text>
                            <Text style={styles.metaValue}>Active</Text>
                        </View>

                    </View>

                </View>


                {/* TELEGRAM */}

                <TouchableOpacity style={styles.telegramBtn} onPress={openTelegram}>
                    <Ionicons name="paper-plane-outline" size={18} color="#8EA2FF" />
                    <Text style={styles.telegramText}>Join Telegram Channel</Text>
                </TouchableOpacity>


                {/* PAYMENT METHOD */}

                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>
                        Select Payment Method
                    </Text>

                    <Text style={styles.sectionDesc}>
                        Choose how you want to complete the deposit
                    </Text>


                    <View style={styles.methodRow}>

                        <TouchableOpacity
                            style={[
                                styles.methodBtn,
                                method === "upi" && styles.activeMethod
                            ]}
                            onPress={() => setMethod("upi")}
                            disabled={submitting}
                        >
                            <Ionicons name="qr-code-outline" size={16} color="#fff" />
                            <Text style={styles.methodText}>UPI</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={[
                                styles.methodBtn,
                                method === "bank" && styles.activeMethod
                            ]}
                            onPress={() => setMethod("bank")}
                            disabled={submitting}
                        >
                            <Text style={styles.methodText}>Bank Transfer</Text>
                        </TouchableOpacity>

                    </View>


                    {/* UPI DETAILS */}

                    {method === "upi" && (

                        <View style={styles.upiBox}>

                            <Text style={styles.upiLabel}>UPI ID</Text>

                            <View style={styles.upiRow}>

                                <Text style={styles.upiId}>
                                    {config.upiId}
                                </Text>

                                <TouchableOpacity style={styles.copyBtn} onPress={copyUpi}>
                                    <Ionicons
                                        name={copied ? "checkmark" : "copy-outline"}
                                        size={18}
                                        color={copied ? "#22C55E" : "#8B5CF6"}
                                    />
                                </TouchableOpacity>

                            </View>

                        </View>

                    )}


                    {/* BANK DETAILS */}

                    {method === "bank" && (

                        <View style={styles.bankBox}>

                            <Text style={styles.bankLabel}>Account Number</Text>
                            <Text style={styles.bankValue}>{config.bankTransfer.accountNumber}</Text>

                            <Text style={styles.bankLabel}>IFSC Code</Text>
                            <Text style={styles.bankValue}>{config.bankTransfer.ifscCode}</Text>

                            <Text style={styles.bankLabel}>Bank Name</Text>
                            <Text style={styles.bankValue}>{config.bankTransfer.bankName}</Text>

                        </View>

                    )}

                </View>



                {/* DEPOSIT FORM */}

                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>
                        Submit Deposit Request
                    </Text>

                    <Text style={styles.sectionDesc}>
                        After completing the payment, submit the details below
                    </Text>


                    {/* COMMISSION INFO */}

                    <Text style={styles.commissionTitle}>
                        Deposit Structure
                    </Text>

                    <View style={styles.commissionBox}>

                        <View style={styles.accountCard}>
                            <Text style={styles.accountTitle}>Saving</Text>
                            <Text style={styles.accountMin}>Min ₹5,000</Text>
                        </View>

                        <View style={styles.accountCard}>
                            <Text style={styles.accountTitle}>Current</Text>
                            <Text style={styles.accountMin}>Min ₹15,000</Text>
                        </View>

                        <View style={styles.accountCard}>
                            <Text style={styles.accountTitle}>Corporate</Text>
                            <Text style={styles.accountMin}>Min ₹45,000</Text>
                        </View>

                    </View>


                    {/* AMOUNT */}

                    <Text style={styles.inputLabel}>Deposit Amount (₹)</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter deposit amount"
                        placeholderTextColor="#6B7280"
                        keyboardType="numeric"
                        value={amount}
                        editable={!submitting}
                        onChangeText={(text) => {
                            const digits = text.replace(/[^0-9]/g, "");
                            setAmount(digits);
                            setErrors((current) => ({ ...current, amount: "" }));
                        }}
                    />
                    {errors.amount ? (
                        <Text style={styles.errorText}>{errors.amount}</Text>
                    ) : null}


                    {/* QUICK AMOUNTS */}

                    <View style={styles.quickRow}>

                        {quickAmounts.map((val) => (

                            <TouchableOpacity
                                key={val}
                                style={styles.quickBtn}
                                onPress={() => {
                                    setAmount(val);
                                    setErrors((current) => ({ ...current, amount: "" }));
                                }}
                                disabled={submitting}
                            >
                                <Text style={styles.quickText}>₹{val}</Text>
                            </TouchableOpacity>

                        ))}

                    </View>


                    <Text style={styles.limitText}>
                        Minimum ₹5,000 • Maximum ₹1,00,000
                    </Text>


                    {/* UTR */}

                    <Text style={styles.inputLabel}>
                        Transaction ID / UTR Number
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter 12 digit UTR number"
                        placeholderTextColor="#6B7280"
                        keyboardType="numeric"
                        value={utr}
                        maxLength={12}
                        editable={!submitting}
                        onChangeText={(text) => {
                            const digits = text.replace(/[^0-9]/g, "");
                            setUtr(digits);
                            setErrors((current) => ({ ...current, utr: "" }));
                        }}
                    />
                    {errors.utr ? (
                        <Text style={styles.errorText}>{errors.utr}</Text>
                    ) : null}


                    {/* UPLOAD */}

                    <TouchableOpacity
                        style={styles.uploadBox}
                        onPress={pickScreenshot}
                        disabled={submitting || pickingScreenshot}
                    >

                        {screenshot ? (

                            <>
                                <Image
                                    source={{ uri: screenshot }}
                                    style={styles.previewImage}
                                />

                                <Text style={styles.uploadChange}>
                                    Change Screenshot
                                </Text>
                            </>

                        ) : (

                            <>
                                {pickingScreenshot ? (
                                    <ActivityIndicator size="large" color="#8B5CF6" />
                                ) : (
                                    <Ionicons
                                        name="cloud-upload-outline"
                                        size={34}
                                        color="#8B5CF6"
                                    />
                                )}

                                <Text style={styles.uploadText}>
                                    Upload Payment Screenshot
                                </Text>

                                <Text style={styles.uploadSub}>
                                    PNG / JPG • Max 10MB
                                </Text>
                            </>

                        )}

                    </TouchableOpacity>
                    {errors.screenshot ? (
                        <Text style={styles.errorText}>{errors.screenshot}</Text>
                    ) : null}



                    {/* INFO */}

                    <View style={styles.infoBox}>

                        <Text style={styles.infoTitle}>
                            Important Information
                        </Text>

                        <Text style={styles.infoText}>
                            Make sure the UTR number and payment screenshot are correct.
                            Incorrect details may delay verification. Deposits are usually
                            approved within 24 hours after verification.
                        </Text>

                    </View>


                    {/* SUBMIT */}

                    <TouchableOpacity
                        style={[
                            styles.submitBtn,
                            (!isValid || submitting || pickingScreenshot) && styles.submitDisabled
                        ]}
                        disabled={!isValid || submitting || pickingScreenshot}
                        onPress={submitDeposit}
                    >

                        {submitting ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={styles.submitText}>
                                Submit Deposit Request
                            </Text>
                        )}

                    </TouchableOpacity>

                </View>

            </ScrollView>

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
