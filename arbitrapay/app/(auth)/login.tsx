import { supabase } from "@/lib/supabase";
import {
  fetchProfileAccessByEmail,
  fetchProfileAccessById,
  isProfileSuspended,
} from "@/services/profileService";
import { styles } from "@/screens/auth/Login.styles";
import { AppColors } from "@/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();

  async function handleSendOtp() {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      const existingProfile = await fetchProfileAccessByEmail(trimmedEmail);

      if (isProfileSuspended(existingProfile?.status)) {
        Alert.alert(
          "Account Suspended",
          "This account has been suspended by the admin and cannot log in."
        );
        return;
      }
    } catch (error: any) {
      Alert.alert("Error", error.message ?? "Unable to validate this account.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: { shouldCreateUser: true },
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    router.push({
      pathname: "/verify-otp",
      params: { email: trimmedEmail },
    });
  }

  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);

      await GoogleSignin.hasPlayServices();

      if (GoogleSignin.hasPreviousSignIn()) {
        await GoogleSignin.signOut();
      }

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        Alert.alert("Login failed", "No Google ID token received");
        return;
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) {
        Alert.alert("Login failed", error.message);
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
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Google login failed");
    } finally {
      setGoogleLoading(false);
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

          {/* BRAND HEADER */}
          <View style={styles.header}>
            <Text style={styles.appName}>ARBITRAPAY</Text>
            <Text style={styles.tagline}>
              Smart finance. Seamless payments.
            </Text>
          </View>

          {/* AUTH CARD */}
          <View style={styles.card}>

            <Text style={styles.title}>
              Continue with <Text style={styles.highlight}>Email</Text>
            </Text>

            <Text style={styles.subtitle}>
              Enter your email to receive a secure verification code.
            </Text>

            {/* EMAIL INPUT */}
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor={AppColors.text.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            {/* EMAIL BUTTON */}
            <TouchableOpacity
              onPress={handleSendOtp}
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
                  <Text style={styles.buttonText}>
                    Send Verification Code
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* DIVIDER */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            {/* GOOGLE BUTTON */}
            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={googleLoading}
              style={styles.googleButton}
            >
              {googleLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <View style={styles.googleContent}>
                  <AntDesign name="google" size={20} color="#DB4437" />
                  <Text style={styles.googleText}>
                    Continue with Google
                  </Text>
                </View>
              )}
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
