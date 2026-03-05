import { useEffect } from 'react';
import * as Linking from "expo-linking";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Href } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import FullScreenLoader from "@/components/FullScreenLoader";

function AuthGuard() {
  const { session, loading, profile } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!segments.length) return;

    const inAuthGroup = segments[0] === "(auth)";

    // 🔒 Not logged in → force login
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login" as Href);
      return;
    }

    // 🔓 Logged in → prevent going back to auth screens
    if (session && inAuthGroup) {
      if (!profile) return; // wait for profile to load

      if (profile.role === "admin") {
        router.replace("/admin" as Href);
      } else {
        router.replace("/" as Href);
      }
    }
  }, [session, loading, segments, profile, router]);

  if (loading) return <FullScreenLoader />;

  return null;
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep link opened:", url);
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthGuard />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
