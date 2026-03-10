import { Tabs, Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { session, loading } = useAuth();
  const insets = useSafeAreaInsets();

  if (loading) return null;

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#0B1220",
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          elevation: 0,
        },

        tabBarActiveTintColor: "#8B5CF6",
        tabBarInactiveTintColor: "#9CA3AF",

        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } 
          else if (route.name === "logs") {
            iconName = focused ? "document-text" : "document-text-outline";
          } 
          else if (route.name === "settings") {
            iconName = focused ? "settings" : "settings-outline";
          } 
          else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="logs" options={{ title: "Logs" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}