import { useEffect } from "react";
import * as Linking from "expo-linking";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Href } from "expo-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { setSessionFromUrl } from "@/lib/supabase-session-from-url";
import FullScreenLoader from "@/components/FullScreenLoader";

function AuthGatedNavigation() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login" as Href);
      return;
    }

    if (session && inAuthGroup) {
      router.replace("/" as Href);
    }
  }, [session, loading, router, segments]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
    </Stack>
  );
}

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const subscription = Linking.addEventListener("url", async ({ url }) => {
      console.log("Deep link opened:", url);

      // Handle OAuth callback deep links (fallback for when openAuthSessionAsync
      // doesn't capture the redirect, e.g. on some Android devices)
      if (url.includes("code=") || url.includes("access_token=")) {
        await setSessionFromUrl(url);
      }
    });

    // Also check the initial URL in case the app was cold-started via an OAuth redirect
    Linking.getInitialURL().then((url) => {
      if (url && (url.includes("code=") || url.includes("access_token="))) {
        console.log("Initial URL contains OAuth params:", url);
        setSessionFromUrl(url);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthGatedNavigation />
      </AuthProvider>
    </ThemeProvider>
  );
}