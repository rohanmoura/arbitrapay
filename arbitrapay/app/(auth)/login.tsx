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
import { supabase } from "@/lib/supabase";
import { styles } from "@/screens/auth/Login.styles";
import { AppColors } from "@/theme/colors";
import * as WebBrowser from "expo-web-browser";
import * as QueryParams from "expo-auth-session/build/QueryParams";

WebBrowser.maybeCompleteAuthSession();


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // EMAIL OTP
  async function handleSendOtp() {
    if (!email) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
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
      params: { email },
    });
  }

  // GOOGLE LOGIN
  async function handleGoogleLogin() {
    const redirectTo = makeRedirectUri();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      if (result.type === "success" && result.url) {
        // Extract tokens from the redirect URL fragment
        const { params, errorCode } = QueryParams.getQueryParams(result.url);

        if (errorCode) {
          Alert.alert("Error", errorCode);
          return;
        }

        const { access_token, refresh_token } = params;

        if (access_token && refresh_token) {
          // Set the session — this triggers onAuthStateChange which handles navigation
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (sessionError) {
            Alert.alert("Error", sessionError.message);
          }
        }
      }
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
            We’ll send you a 6-digit verification code
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

          {/* EMAIL OTP BUTTON */}
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
            disabled={loading}
            style={[
              styles.button,
              {
                backgroundColor: "#FFFFFF",
                marginTop: 4,
              },
            ]}
          >
            <Text style={{ color: "#000", fontWeight: "600" }}>
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}