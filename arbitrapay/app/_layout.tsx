// Import the deep link handler FIRST — it registers module-level listeners
// that capture OAuth redirect URLs before any React component mounts.
import "@/lib/oauth-redirect-handler";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthGatedNavigation />
      </AuthProvider>
    </ThemeProvider>
  );
}
