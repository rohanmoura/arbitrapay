import { styles } from "@/screens/feature-compo/Updates.style";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Updates() {

    const router = useRouter();

    const updates = [

        {
            id: 1,
            date: "Today",
            content:
                `(Saving Account)

gaming fund 3.8% commission 

mixed fund 4.8% commission 

stock fund 5.8% commission 

(Current Account)

gaming fund 3.8% commission 

mixed fund 4.8% commission 

stock fund 5.8% commission 

(Corporate Account)

gaming fund 3.8% commission 

mixed fund 4.8% commission 

stock fund 5.8% commission`
        },
    ];

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

                {updates.map((item) => (

                    <View key={item.id} style={styles.updateCard}>

                        <View style={styles.updateAccent} />

                        <View style={styles.updateContentWrap}>

                            <View style={styles.updateHeader}>

                                <View style={styles.adminBadge}>
                                    <Ionicons name="megaphone-outline" size={14} color="#8B5CF6" />
                                    <Text style={styles.adminText}>
                                        Commision Update
                                    </Text>
                                </View>

                                <View style={styles.dateRow}>

                                    <Text style={styles.updateDate}>
                                        {item.date}
                                    </Text>

                                    {item.date === "Today" && (
                                        <View style={styles.newBadge}>
                                            <Text style={styles.newText}>
                                                NEW
                                            </Text>
                                        </View>
                                    )}

                                </View>

                            </View>

                            <Text style={styles.updateContent}>
                                {item.content}
                            </Text>

                        </View>

                    </View>

                ))}

            </ScrollView>

        </SafeAreaView>

    );

}