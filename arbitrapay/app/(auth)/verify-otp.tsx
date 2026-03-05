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
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabase";
import { AppColors } from "@/theme/colors";
import { styles } from "@/screens/auth/VerifyOtp.styles";

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();

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

    // Try verification with multiple OTP types to handle all Supabase GoTrue versions.
    // Modern GoTrue supports "email" as a catch-all, but older versions require the
    // specific type: "magiclink" for existing users, "signup" for new users created
    // by signInWithOtp with shouldCreateUser: true.
    // Failed attempts with the wrong type do NOT consume the OTP.
    const typesToTry: ("email" | "magiclink" | "signup")[] = [
      "email",
      "magiclink",
      "signup",
    ];

    let lastError: { message: string } | null = null;

    for (const type of typesToTry) {
      const { error } = await supabase.auth.verifyOtp({
        email: trimmedEmail,
        token: trimmedOtp,
        type,
      });

      if (!error) {
        // Success — navigation is handled automatically by AuthGatedNavigation
        // when onAuthStateChange fires with the new session.
        setLoading(false);
        return;
      }

      lastError = error;
    }

    setLoading(false);
    Alert.alert("Verification Failed", lastError?.message || "Invalid OTP");
  }

  async function handleResend() {
    if (!email) {
      Alert.alert("Error", "Email missing. Please go back and try again.");
      return;
    }

    setResending(true);

    await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    });

    setResending(false);
    Alert.alert("Code Sent", "A new verification code has been sent to your email.");
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