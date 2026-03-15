import { useHelpCenter } from "@/hooks/useHelpCenter";
import { styles } from "@/screens/feature-compo/HelpCenter.style";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpCenter() {

    const router = useRouter();
    const {
        categories,
        ticketVisible,
        category,
        subject,
        message,
        submitting,
        canSubmit,
        setCategory,
        setSubject,
        setMessage,
        openTelegram,
        openTicketModal,
        closeTicketModal,
        submitTicket
    } = useHelpCenter();

    return (

        <SafeAreaView style={styles.safeArea}>

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >

                {/* Header */}

                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>
                            Support
                        </Text>
                    </View>

                </View>

                <Text style={styles.subtitle}>
                    Get help with your account
                </Text>


                {/* Telegram Button */}

                <TouchableOpacity
                    style={styles.telegramBtn}
                    onPress={openTelegram}
                    activeOpacity={0.85}
                >

                    <Ionicons name="paper-plane-outline" size={18} color="#fff" />

                    <Text style={styles.telegramText}>
                        Telegram Channel
                    </Text>

                </TouchableOpacity>


                {/* Empty Ticket State */}

                <View style={styles.ticketCard}>

                    <Ionicons
                        name="headset-outline"
                        size={54}
                        color="#94A3B8"
                    />

                    <Text style={styles.emptyTitle}>
                        No Support Tickets
                    </Text>

                    <Text style={styles.emptyDesc}>
                        Our support team is here to help you
                    </Text>

                    <TouchableOpacity
                        style={styles.createTicketBtn}
                        onPress={openTicketModal}
                    >

                        <Ionicons name="add" size={18} color="#fff" />

                        <Text style={styles.createTicketText}>
                            Create Ticket
                        </Text>

                    </TouchableOpacity>

                </View>

            </ScrollView>


            {/* Ticket Modal */}

            <Modal
                visible={ticketVisible}
                transparent
                animationType="slide"
            >

                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback
                        onPress={closeTicketModal}
                    >
                        <View style={styles.modalBackdrop} />
                    </TouchableWithoutFeedback>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                    >
                        <View style={styles.modalCard}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={styles.modalHandle} />

                                <View style={styles.modalHeader}>

                                    <Text style={styles.modalTitle}>
                                        Create Support Ticket
                                    </Text>

                                    <TouchableOpacity
                                        onPress={closeTicketModal}
                                    >

                                        <Ionicons name="close" size={22} color="#64748B" />

                                    </TouchableOpacity>

                                </View>

                                <Text style={styles.modalSubtitle}>
                                    Describe your issue and we&apos;ll get back to you
                                </Text>


                                {/* Category */}

                                <Text style={styles.inputLabel}>
                                    Category
                                </Text>

                                <View style={styles.categoryBox}>

                                    {categories.map((item) => (
                                        <TouchableOpacity
                                            key={item}
                                            onPress={() => setCategory(item)}
                                            style={[
                                                styles.categoryItem,
                                                category === item && styles.categoryActive
                                            ]}
                                        >

                                            <Text
                                                style={[
                                                    styles.categoryText,
                                                    category === item && styles.categoryTextActive
                                                ]}
                                            >
                                                {item}
                                            </Text>

                                        </TouchableOpacity>
                                    ))}

                                </View>


                                {/* Subject */}

                                <Text style={styles.inputLabel}>
                                    Subject
                                </Text>

                                <TextInput
                                    placeholder="Brief description of your issue"
                                    placeholderTextColor="#9CA3AF"
                                    style={styles.input}
                                    value={subject}
                                    onChangeText={setSubject}
                                />


                                {/* Message */}

                                <Text style={styles.inputLabel}>
                                    Message
                                </Text>

                                <TextInput
                                    placeholder="Explain your issue in detail..."
                                    placeholderTextColor="#9CA3AF"
                                    style={styles.textArea}
                                    multiline
                                    value={message}
                                    onChangeText={setMessage}
                                />


                                {/* Submit */}

                                <TouchableOpacity style={[
                                    styles.submitBtn,
                                    (!canSubmit || submitting) && { opacity: 0.5 }
                                ]} disabled={!canSubmit} onPress={submitTicket}>
                                    {submitting ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="paper-plane-outline" size={18} color="#fff" />
                                    )}

                                    <Text style={styles.submitText}>
                                        {submitting ? "Submitting..." : "Submit Ticket"}
                                    </Text>

                                </TouchableOpacity>
                                <Text style={styles.responseTime}>
                                    Typical response time: 20 - 24 hours
                                </Text>

                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>

            </Modal>

        </SafeAreaView>

    )

}
