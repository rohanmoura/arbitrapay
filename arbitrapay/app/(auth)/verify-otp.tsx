import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabase";
import { AppColors } from "@/theme/colors";
import { styles } from "@/screens/auth/VerifyOtp.styles";

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerify() {
    if (!email) {
      Alert.alert("Error", "Email not found. Please try again.");
      return;
    }

    if (otp.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit code.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    setLoading(false);

    if (error) {
      Alert.alert("Verification Failed", error.message);
      return;
    }

    router.replace("/");
  }

  async function handleResend() {
    if (!email) return;

    setResending(true);

    await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    setResending(false);
  }

  return (
    <LinearGradient
      colors={[
        AppColors.background.primary,
        AppColors.background.secondary,
        AppColors.background.tertiary,
      ]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.wrapper}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to your email
          </Text>

          <TextInput
            placeholder="••••••"
            placeholderTextColor={AppColors.text.muted}
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={handleVerify}
            disabled={loading}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={AppColors.accent.gradient}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResend}
            disabled={resending}
            style={{ marginTop: 18 }}
          >
            <Text style={{ color: AppColors.text.secondary, textAlign: "center" }}>
              {resending ? "Resending..." : "Resend Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}