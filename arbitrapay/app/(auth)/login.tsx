import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabase";
import { styles } from "@/screens/auth/Login.styles";
import { AppColors } from "@/theme/colors";
import { extractOAuthParams } from "@/lib/oauth-helpers";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  // EMAIL OTP LOGIN (UNCHANGED)
  async function handleSendOtp() {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        shouldCreateUser: true,
      },
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

  // GOOGLE OAUTH LOGIN
  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);

      const redirectUri = makeRedirectUri({ scheme: "arbitrapay" });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error || !data.url) {
        Alert.alert("Error", error?.message ?? "Failed to start Google login");
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri
      );

      if (result.type !== "success" || !result.url) {
        // User cancelled or browser dismissed
        return;
      }

      const params = extractOAuthParams(result.url);

      if (params.code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(params.code);

        if (exchangeError) {
          Alert.alert("Login failed", exchangeError.message);
        }
        // Session is now established — AuthContext will detect it automatically
      } else if (params.error_description) {
        Alert.alert("Login failed", params.error_description);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      Alert.alert("Error", message);
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
        style={styles.wrapper}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            Continue with <Text style={styles.highlight}>Email</Text>
          </Text>

          <Text style={styles.subtitle}>
            We&apos;ll send you a 6-digit verification code
          </Text>

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
                <Text style={styles.buttonText}>Send Code</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* DIVIDER */}
          <View style={{ marginVertical: 16, alignItems: "center" }}>
            <Text style={{ color: AppColors.text.muted }}>OR</Text>
          </View>

          {/* GOOGLE BUTTON */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={googleLoading}
            style={[
              styles.button,
              {
                backgroundColor: "#FFFFFF",
                marginTop: 4,
              },
            ]}
          >
            {googleLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={{ color: "#000", fontWeight: "600" }}>
                Continue with Google
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}