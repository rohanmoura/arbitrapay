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
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";
import { setSessionFromUrl } from "@/lib/supabase-session-from-url";
import { styles } from "@/screens/auth/Login.styles";
import { AppColors } from "@/theme/colors";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // EMAIL OTP LOGIN
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

  // GOOGLE LOGIN
  async function handleGoogleLogin() {
    try {
      setLoading(true);

      const redirectTo = makeRedirectUri({
        scheme: "arbitrapay",
      });

      console.log("REDIRECT URI:", redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        setLoading(false);
        Alert.alert("Error", error.message);
        return;
      }

      if (data?.url) {
        // On Android, the browser may return "dismiss" instead of "success"
        // when a custom scheme redirect fires. Set up a deep link listener
        // as a fallback to capture the redirect URL.
        let deepLinkUrl: string | null = null;
        const linkSubscription = Linking.addEventListener("url", ({ url }) => {
          deepLinkUrl = url;
        });

        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        console.log("AUTH SESSION RESULT:", result);

        // Use the URL from the browser result, or fall back to the deep link
        const redirectUrl =
          (result.type === "success" && result.url) ? result.url : deepLinkUrl;

        linkSubscription.remove();

        if (redirectUrl) {
          console.log("REDIRECT URL:", redirectUrl);
          await setSessionFromUrl(redirectUrl);

          const { data: sessionData } = await supabase.auth.getSession();
          console.log("CURRENT SESSION:", sessionData.session);
        }
      }

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      Alert.alert("Error", err.message || "Google login failed");
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
            disabled={loading}
            style={[
              styles.button,
              {
                backgroundColor: "#FFFFFF",
                marginTop: 4,
              },
            ]}
          >
            {loading ? (
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