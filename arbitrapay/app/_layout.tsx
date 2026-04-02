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

  const authenticatedScreens = [
    <Stack.Screen key="tabs" name="(tabs)" />,
    <Stack.Screen key="account-activation" name="account-activation/index" />,
    <Stack.Screen key="ai-assistant" name="ai-assistant/index" />,
    <Stack.Screen key="bank-account" name="bank-account/index" />,
    <Stack.Screen key="help-center" name="help-center/index" />,
    <Stack.Screen key="live-deposit" name="live-deposit/index" />,
    <Stack.Screen key="payment-history" name="payment-history/index" />,
    <Stack.Screen key="referral" name="referral/index" />,
    <Stack.Screen key="security-deposit" name="security-deposit/index" />,
    <Stack.Screen key="updates" name="updates/index" />,
    <Stack.Screen key="admin-update-detail" name="admin-update-detail/index" />,
    <Stack.Screen key="user-account-activations" name="user-account-activations/index" />,
    <Stack.Screen key="user-bank-account" name="user-bank-account/index" />,
    <Stack.Screen key="user-detail" name="user-detail/index" />,
    <Stack.Screen key="user-live-deposit" name="user-live-deposit/index" />,
    <Stack.Screen key="user-live-deposit-history" name="user-live-deposit-history/index" />,
    <Stack.Screen key="user-security-deposit" name="user-security-deposit/index" />,
    <Stack.Screen key="user-withdrawal" name="user-withdrawal/index" />,
    <Stack.Screen key="user-transactions" name="user-transactions/index" />,
    <Stack.Screen key="withdrawal" name="withdrawal/index" />,
    <Stack.Screen key="security" name="security" />,
  ];

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? authenticatedScreens : <Stack.Screen name="(auth)" />}
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
