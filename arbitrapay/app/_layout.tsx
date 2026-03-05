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
        <>
          {/* Logged in */}
          <Stack.Screen name="(tabs)" />
        </>
      ) : (
        <>
          {/* Not logged in */}
          <Stack.Screen name="(auth)" />
        </>
      )}
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

      if (url.includes("code=") || url.includes("access_token=")) {
        await setSessionFromUrl(url);
      }
    });

    Linking.getInitialURL().then((url) => {
      if (url && (url.includes("code=") || url.includes("access_token="))) {
        console.log("Initial URL:", url);
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