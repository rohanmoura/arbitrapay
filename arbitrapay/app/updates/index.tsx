import { styles } from "@/screens/feature-compo/Updates.style";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useUpdates } from "@/hooks/useUpdates";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatUpdateDate(date: string | null) {
    if (!date) {
        return "Recently";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(date));
}

export default function Updates() {

    const router = useRouter();
    const { loading, updates } = useUpdates();

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
                        Updates
                    </Text>

                </View>

                <Text style={styles.subtitle}>
                    Latest announcements from admin
                </Text>

                {updates.map((item, index) => (

                    <View key={item.id} style={styles.updateCard}>

                        <View style={styles.updateAccent} />

                        <View style={styles.updateContentWrap}>

                            <View style={styles.updateHeader}>

                                <View style={styles.adminBadge}>
                                    <Ionicons name="megaphone-outline" size={14} color="#8B5CF6" />
                                    <Text style={styles.adminText}>
                                        {item.title}
                                    </Text>
                                </View>

                                <View style={styles.dateRow}>

                                    <Text style={styles.updateDate}>
                                        {formatUpdateDate(item.created_at)}
                                    </Text>

                                    {index === 0 && (
                                        <View style={styles.newBadge}>
                                            <Text style={styles.newText}>
                                                NEW
                                            </Text>
                                        </View>
                                    )}

                                </View>

                            </View>

                            <Text style={styles.updateContent}>
                                {item.message}
                            </Text>

                        </View>

                    </View>

                ))}

                {!updates.length && (
                    <View style={styles.updateCard}>
                        <View style={styles.updateAccent} />
                        <View style={styles.updateContentWrap}>
                            <View style={styles.updateHeader}>
                                <View style={styles.adminBadge}>
                                    <Ionicons name="megaphone-outline" size={14} color="#8B5CF6" />
                                    <Text style={styles.adminText}>
                                        No Updates
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.updateContent}>
                                Admin updates will appear here as soon as they are published.
                            </Text>
                        </View>
                    </View>
                )}

            </ScrollView>

        </SafeAreaView>

    );

}
