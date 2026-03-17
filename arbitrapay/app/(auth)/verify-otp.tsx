import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabase";
import {
  fetchProfileAccessByEmail,
  fetchProfileAccessById,
  isProfileSuspended,
} from "@/services/profileService";
import { AppColors } from "@/theme/colors";
import { styles } from "@/screens/auth/VerifyOtp.styles";

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  function handleOtpChange(text: string, index: number) {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(
    e: { nativeEvent: { key: string } },
    index: number
  ) {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    if (!email) {
      Alert.alert("Error", "Email not found. Please try again.");
      return;
    }

    const trimmedOtp = otp.join("");

    if (trimmedOtp.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit code.");
      return;
    }

    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.verifyOtp({
      email: trimmedEmail,
      token: trimmedOtp,
      type: "magiclink",
    });

    setLoading(false);

    if (error) {
      Alert.alert("Verification Failed", error.message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const profile = await fetchProfileAccessById(user.id);

      if (isProfileSuspended(profile?.status)) {
        await supabase.auth.signOut();
        Alert.alert(
          "Account Suspended",
          "This account has been suspended by the admin and cannot log in."
        );
        return;
      }
    }

    router.replace("/(tabs)");
  }

  async function handleResend() {
    if (!email) {
      Alert.alert("Error", "Email missing. Please go back and try again.");
      return;
    }

    try {
      const existingProfile = await fetchProfileAccessByEmail(email);

      if (isProfileSuspended(existingProfile?.status)) {
        Alert.alert(
          "Account Suspended",
          "This account has been suspended by the admin and cannot log in."
        );
        return;
      }
    } catch (fetchError: any) {
      Alert.alert(
        "Error",
        fetchError.message ?? "Unable to validate this account."
      );
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
      setTimeLeft(300); // reset timer
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
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.wrapper}
          keyboardShouldPersistTaps="handled"
        >

          {/* LOGO */}
          <View style={styles.logoWrapper}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
            />
          </View>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.appName}>ARBITRAPAY</Text>
            <Text style={styles.tagline}>
              Secure email verification
            </Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>

            <Text style={styles.title}>
              Verify <Text style={styles.highlight}>Email</Text>
            </Text>

            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{" "}
              <Text style={styles.email}>{email}</Text>
            </Text>

            {/* OTP BOXES */}
            <View style={styles.otpContainer}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  style={styles.otpBox}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={otp[index]}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>

            {/* VERIFY BUTTON */}
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
                  <Text style={styles.buttonText}>Verify Code</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* RESEND */}
            <TouchableOpacity
              onPress={handleResend}
              disabled={resending || timeLeft > 0}
              style={styles.resendWrapper}
            >
              <Text style={styles.resendText}>
                {timeLeft > 0
                  ? `Resend in ${formatTime(timeLeft)}`
                  : resending
                  ? "Resending..."
                  : "Resend Code"}
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
