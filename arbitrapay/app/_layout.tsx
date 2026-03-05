import { useEffect } from "react";
import * as Linking from "expo-linking";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { setSessionFromUrl } from "@/lib/supabase-session-from-url";
import FullScreenLoader from "@/components/FullScreenLoader";

function AuthGatedNavigation() {
  const { session, loading } = useAuth();

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

  useEffect(() => {

    const handleUrl = async (url: string | null) => {
      if (!url) return;

      console.log("DEEP LINK URL:", url);

      if (
        url.includes("code=") ||
        url.includes("access_token=") ||
        url.includes("refresh_token=")
      ) {
        await setSessionFromUrl(url);
      }
    };

    // when app already open
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });

    // when app opened from closed state
    Linking.getInitialURL().then(handleUrl);

    return () => {
      subscription.remove();
    };

  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthGatedNavigation />
      </AuthProvider>
    </ThemeProvider>
  );
}