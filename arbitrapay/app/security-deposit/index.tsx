import FullScreenLoader from "@/components/FullScreenLoader";
import { styles } from "@/screens/feature-compo/SecurityDeposit.styles";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SecurityDeposit() {

    const [amount, setAmount] = useState("");
    const [utr, setUtr] = useState("");
    const [method, setMethod] = useState<"upi" | "bank">("upi");
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [toast, setToast] = useState("");
    const router = useRouter();

    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const quickAmounts = ["5000", "10000", "20000", "50000"];

    const isValid =
        amount &&
        Number(amount) >= 5000 &&
        utr.length >= 12;

    const copyUpi = async () => {

        await Clipboard.setStringAsync("himanshu8540@ptyes");

        setCopied(true);
        setToast("UPI ID copied");

        setTimeout(() => {
            setCopied(false);
            setToast("");
        }, 2000);

    };

    const pickScreenshot = async () => {

        try {

            setLoading(true);

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
            });

            if (!result.canceled) {
                setScreenshot(result.assets[0].uri);
            }

        } finally {
            setLoading(false);
        }

    };

    const submitDeposit = async () => {

        try {

            setLoading(true);

            await new Promise(resolve => setTimeout(resolve, 1500));

            setToast("Deposit request submitted");

        } finally {
            setLoading(false);
        }

    };

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: "#0B1220" }}>

            {loading && <FullScreenLoader />}

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
                            <Text style={styles.metaValue}>—</Text>
                        </View>

                        <View>
                            <Text style={styles.metaLabel}>Status</Text>
                            <Text style={styles.metaValue}>Active</Text>
                        </View>

                    </View>

                </View>


                {/* TELEGRAM */}

                <TouchableOpacity style={styles.telegramBtn}>
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
                                    himanshu8540@ptyes
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
                            <Text style={styles.bankValue}>XXXXXX1234</Text>

                            <Text style={styles.bankLabel}>IFSC Code</Text>
                            <Text style={styles.bankValue}>HDFC0001234</Text>

                            <Text style={styles.bankLabel}>Bank Name</Text>
                            <Text style={styles.bankValue}>HDFC Bank</Text>

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
                        onChangeText={setAmount}
                    />


                    {/* QUICK AMOUNTS */}

                    <View style={styles.quickRow}>

                        {quickAmounts.map((val) => (

                            <TouchableOpacity
                                key={val}
                                style={styles.quickBtn}
                                onPress={() => setAmount(val)}
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
                        onChangeText={setUtr}
                    />


                    {/* UPLOAD */}

                    <TouchableOpacity
                        style={styles.uploadBox}
                        onPress={pickScreenshot}
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
                                <Ionicons
                                    name="cloud-upload-outline"
                                    size={34}
                                    color="#8B5CF6"
                                />

                                <Text style={styles.uploadText}>
                                    Upload Payment Screenshot
                                </Text>

                                <Text style={styles.uploadSub}>
                                    PNG / JPG • Max 10MB
                                </Text>
                            </>

                        )}

                    </TouchableOpacity>



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
                            !isValid && styles.submitDisabled
                        ]}
                        disabled={!isValid}
                        onPress={submitDeposit}
                    >

                        <Text style={styles.submitText}>
                            Submit Deposit Request
                        </Text>

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