import useCountUp from "@/hooks/useCountUp";
import { supabase } from "@/lib/supabase";
import { styles } from "@/screens/dashboard/WalletCard.styles";
import { AppColors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";

export default function WalletCard() {

  const [name, setName] = useState("User");
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateAnim = useRef(new Animated.Value(40)).current;
  const demoBalance = useCountUp(1248.75);

  const startAnimation = useCallback(() => {

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true
      }),
      Animated.spring(translateAnim, {
        toValue: 0,
        friction: 7,
        useNativeDriver: true
      })
    ]).start();

  }, [scaleAnim, translateAnim]);

  useEffect(() => {
    getUserName();
    startAnimation();
  }, [startAnimation]);

  const getUserName = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const googleName = user.user_metadata?.full_name;

    if (googleName) {
      setName(googleName.split(" ")[0]);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();

    if (data?.name) {
      setName(data.name);
    }
  };

  return (
    <View>

      {/* GREETING */}
      <View style={styles.greetingRow}>
        <Text style={styles.greetingText}>
          Welcome, {name}
        </Text>
      </View>

      <Animated.View
        style={[
          styles.cardWrapper,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateAnim }
            ]
          }
        ]}
      >

        {/* BORDER GLOW */}
        <LinearGradient
          colors={["#7C3AED", "#6366F1", "transparent"]}
          style={styles.borderGlow}
        />

        {/* CARD */}
        <LinearGradient
          colors={["#0F172A", "#020617"]}
          style={styles.card}
        >

          {/* HEADER */}
          <View style={styles.headerRow}>
            <View style={styles.balanceHeader}>
              <Ionicons name="wallet-outline" size={18} color="#A78BFA" />
              <Text style={styles.walletTitle}>Total Balance</Text>
            </View>

            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
            />
          </View>

          {/* BALANCE */}
          <Text style={styles.balance}>{demoBalance}</Text>

          <View style={styles.divider} />

          {/* COMMISSION */}
          <View style={styles.commissionRow}>
            <Text style={styles.commissionLabel}>
              {"Today's Commission"}
            </Text>

            <Text style={styles.commissionValue}>
              0.00
            </Text>
          </View>

          {/* ACTIONS */}
          <View style={styles.actions}>

            <TouchableOpacity
              style={styles.depositBtn}
              onPress={() => router.push("/security-deposit" as Href)}
            >
              <Ionicons name="add-circle-outline" size={18} color="#fff" />
              <Text style={styles.depositText}>Add Money</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.withdrawBtn}
              onPress={() => router.push("/withdrawal" as Href)}
            >
              <Ionicons
                name="arrow-down-circle-outline"
                size={18}
                color={AppColors.text.primary}
              />
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>

          </View>

        </LinearGradient>

      </Animated.View>

    </View>
  );
}
