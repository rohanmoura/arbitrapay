import { configureGoogle } from "@/lib/google";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import FullScreenLoader from "@/components/FullScreenLoader";

configureGoogle();

function AuthGatedNavigation() {
  const { session, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="account-activation/index" />
          <Stack.Screen name="ai-assistant/index" />
          <Stack.Screen name="bank-account/index" />
          <Stack.Screen name="help-center/index" />
          <Stack.Screen name="live-deposit/index" />
          <Stack.Screen name="payment-history/index" />
          <Stack.Screen name="referral/index" />
          <Stack.Screen name="security-deposit/index" />
          <Stack.Screen name="updates/index" />
          <Stack.Screen name="user-bank-account/index" />
          <Stack.Screen name="user-detail/index" />
          <Stack.Screen name="user-security-deposit/index" />
          <Stack.Screen name="withdrawal/index" />
          <Stack.Screen name="security" />
        </>
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <AuthGatedNavigation />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
