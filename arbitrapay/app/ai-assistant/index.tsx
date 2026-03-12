import { styles } from "@/screens/feature-compo/AiAssistant.style";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const quickQuestions = [
    "What is the ArbhitraPay panel?",
    "How much is the security deposit?",
    "When will the panel be activated?",
    "How much commission will I get?",
    "What documents are required?",
    "How can I transfer funds?"
];

const answers: Record<string, string> = {
    "What is the ArbhitraPay panel?":
        "The ArbhitraPay panel is a digital dashboard where you can manage transactions and earn commission.",

    "How much is the security deposit?":
        "A one-time security deposit is required to activate the ArbhitraPay panel.",

    "When will the panel be activated?":
        "Your panel is usually activated within 5–15 minutes after the security deposit is received.",

    "How much commission will I get?":
        "Commission is provided on every successful transaction and may vary depending on the transaction type.",

    "What documents are required?":
        "Basic verification usually requires an identity proof and your bank account details.",

    "How can I transfer funds?":
        "You can add funds through the deposit section available in your dashboard."
};

const defaultReply =
    "Sorry, we are currently unable to answer your question due to a temporary technical issue. Please visit the Support section to contact us on Telegram or raise a support ticket for assistance.";

export default function AiAssistant() {

    const [messages, setMessages] = useState([
        {
            id: "1",
            type: "bot",
            text:
                "Hello! I am the ArbhitraPay AI Assistant. You can ask me questions related to the ArbhitraPay panel. How can I help you today?"
        }
    ]);

    const sendMessage = (text: string) => {

        setMessages(prev => [
            ...prev,
            { id: Date.now() + "u", type: "user", text }
        ]);

        setTimeout(() => {

            const reply =
                answers[text.trim()] ||
                answers[text.trim().toLowerCase()] ||
                defaultReply;

            setMessages(prev => [
                ...prev,
                { id: Date.now() + "b", type: "bot", text: reply }
            ]);

        }, 800);

    };

    const scrollRef = useRef<ScrollView>(null);

    const router = useRouter();

    const [input, setInput] = useState("");

    const handleQuickQuestion = (question: string) => {
        sendMessage(question);
    };

    const handleSend = () => {

        if (!input.trim()) return;

        sendMessage(input);

        setInput("");

    };

    return (

        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={90}
            >
                <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    onContentSizeChange={() =>
                        scrollRef.current?.scrollToEnd({ animated: true })
                    }
                >
                    <View style={styles.header}>

                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => router.replace("/")}
                        >
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>
                            AI Assistant
                        </Text>

                    </View>

                    {/* AI CARD */}

                    <View style={styles.aiCard}>

                        <View style={styles.aiIcon}>
                            <Image
                                source={require("@/assets/images/icon.png")}
                                style={{ width: 26, height: 26 }}
                            />
                        </View>

                        <View style={{ flex: 1 }}>

                            <Text style={styles.aiTitle}>
                                ArbhitraPay AI Assistant
                            </Text>

                            <Text style={styles.aiDesc}>
                                Answers to your questions, 24/7
                            </Text>

                        </View>

                    </View>


                    {/* CHAT */}

                    <View style={styles.chatArea}>

                        {messages.map(msg => (

                            <View
                                key={msg.id}
                                style={msg.type === "bot" ? styles.botRow : styles.userRow}
                            >

                                {msg.type === "bot" && (
                                    <View style={styles.botIcon}>
                                        <Image
                                            source={require("@/assets/images/icon.png")}
                                            style={{ width: 16, height: 16 }}
                                        />
                                    </View>
                                )}

                                <View
                                    style={msg.type === "bot"
                                        ? styles.botMessage
                                        : styles.userMessage}
                                >
                                    <Text style={styles.messageText}>
                                        {msg.text}
                                    </Text>
                                </View>

                                {msg.type === "user" && (
                                    <View style={styles.userIcon}>
                                        <Ionicons name="person-outline" size={16} color="#fff" />
                                    </View>
                                )}

                            </View>

                        ))}

                    </View>

                </ScrollView>


                {/* INPUT */}
                <View style={styles.inputWrapper}>

                    <View style={styles.inputBox}>

                        <TextInput
                            placeholder="Type your question here"
                            placeholderTextColor="#6B7280"
                            style={styles.input}
                            value={input}
                            onChangeText={setInput}
                            onFocus={() =>
                                scrollRef.current?.scrollToEnd({ animated: true })
                            }
                        />

                        <TouchableOpacity
                            style={styles.sendBtn}
                            onPress={handleSend}
                        >
                            <Ionicons name="paper-plane-outline" size={18} color="#fff" />
                        </TouchableOpacity>

                    </View>


                    {/* QUICK QUESTIONS */}

                    <View style={styles.quickContainer}>

                        {quickQuestions.map(q => (

                            <TouchableOpacity
                                key={q}
                                style={styles.quickBtn}
                                onPress={() => handleQuickQuestion(q)}
                            >

                                <Text style={styles.quickText}>
                                    {q}
                                </Text>

                            </TouchableOpacity>

                        ))}

                    </View>

                </View>

            </KeyboardAvoidingView>

        </SafeAreaView>

    );

}