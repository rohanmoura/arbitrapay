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

    const trimmedOtp = otp.trim();

    if (trimmedOtp.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit code.");
      return;
    }

    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    console.log("EMAIL:", trimmedEmail);
    console.log("OTP:", trimmedOtp);

    const { error } = await supabase.auth.verifyOtp({
      email: trimmedEmail,
      token: trimmedOtp,
      type: "magiclink",
    });

    // console.log("VERIFY DATA:", data);
    // console.log("VERIFY ERROR:", error);

    setLoading(false);

    if (error) {
      Alert.alert("Verification Failed", error.message);
      return;
    }

    // OTP verified successfully → go to home
    router.replace("/");
  }

  async function handleResend() {
    if (!email) {
      Alert.alert("Error", "Email missing. Please go back and try again.");
      return;
    }

    setResending(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    });

    setResending(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Code Sent", "A new verification code has been sent.");
    }
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
            textContentType="oneTimeCode"
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
            <Text
              style={{
                color: AppColors.text.secondary,
                textAlign: "center",
              }}
            >
              {resending ? "Resending..." : "Resend Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}