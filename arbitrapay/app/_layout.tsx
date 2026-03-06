import { useEffect, useRef } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as Linking from "expo-linking";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { extractOAuthParams } from "@/lib/oauth-helpers";
import FullScreenLoader from "@/components/FullScreenLoader";

function AuthGatedNavigation() {
  const { session, loading } = useAuth();

  // Handle OAuth redirect URLs (cold-start + warm-start).
  // expo-linking's useURL() is designed to work with Expo Router and
  // correctly captures the URL that launched the app, unlike React
  // Native's Linking.getInitialURL() which Expo Router may consume first.
  const url = Linking.useURL();
  const processedCodes = useRef(new Set<string>());

  useEffect(() => {
    if (!url) return;

    const params = extractOAuthParams(url);
    if (!params.code) return;

    // Avoid exchanging the same code twice (useURL may re-emit the URL)
    if (processedCodes.current.has(params.code)) return;
    processedCodes.current.add(params.code);

    console.log("OAuth redirect detected, exchanging code for session");
    supabase.auth.exchangeCodeForSession(params.code).then(({ error }) => {
      if (error) {
        console.log("OAuth code exchange error:", error.message);
      }
    });
  }, [url]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthGatedNavigation />
      </AuthProvider>
    </ThemeProvider>
  );
}