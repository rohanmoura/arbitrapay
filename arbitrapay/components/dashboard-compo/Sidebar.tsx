import { styles } from "@/screens/dashboard/Sidebar.styles";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Pressable,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get("window");

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function Sidebar({ visible, onClose }: Props) {

    const slide = useRef(new Animated.Value(-width)).current;
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        Animated.timing(slide, {
            toValue: visible ? 0 : -width,
            duration: 280,
            useNativeDriver: true
        }).start();
    }, [visible, slide]);

    const tabs = [
        { icon: "shield-checkmark-outline", label: "Verify Account", route: "/account-activation" },
        { icon: "pulse-outline", label: "Live Activity" },
        {
            icon: "lock-closed-outline",
            label: "Security Wallet",
            route: "/security-deposit"
        },
        { icon: "business-outline", label: "Linked Banks", route: "/bank-account" },
        {
            icon: "arrow-down-outline",
            label: "Withdraw Funds",
            route: "/withdrawal"
        },
        { icon: "swap-horizontal-outline", label: "Payment History", route: "/payment-history" },
        { icon: "headset-outline", label: "Help Center" }
    ];

    return (
        <>
            {/* BACKDROP */}
            {visible && (
                <Pressable style={styles.backdrop} onPress={onClose} />
            )}

            <Animated.View
                style={[
                    styles.drawer,
                    { transform: [{ translateX: slide }] }
                ]}
            >

                {/* HEADER */}
                <View style={styles.header}>
                    <Image
                        source={require("@/assets/images/icon.png")}
                        style={styles.logo}
                    />

                    <View>
                        <Text style={styles.appName}>ArbitraPay</Text>
                        <Text style={styles.sub}>Account Panel</Text>
                    </View>
                </View>

                {/* MENU */}
                <View style={styles.menu}>
                    {tabs.map((tab, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.item,
                                pathname === tab.route && styles.activeItem
                            ]}
                            activeOpacity={0.7}
                            onPress={() => {
                                if (tab.route) {
                                    router.push(tab.route as any);
                                    onClose();
                                }
                            }}
                        >
                            <Ionicons
                                name={tab.icon as any}
                                size={20}
                                color={pathname === tab.route ? "#8B5CF6" : "#9CA3AF"}
                            />
                            <Text
                                style={[
                                    styles.label,
                                    pathname === tab.route && { color: "#8B5CF6" }
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* SPACER */}
                <View style={{ flex: 1 }} />

                {/* LOGOUT BUTTON */}
                <View style={styles.logoutContainer}>
                    <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
                        <Ionicons
                            name="log-out-outline"
                            size={20}
                            color="#EF4444"
                        />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

            </Animated.View>
        </>
    );
}
