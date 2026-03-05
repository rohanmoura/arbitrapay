import { Tabs, Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function TabLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;

  // 🚨 block tabs if user not logged in
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
    </Tabs>
  );
}