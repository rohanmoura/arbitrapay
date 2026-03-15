import { useProfile } from "@/hooks/useProfile";
import { useTransactionNotifications } from "@/hooks/useTransactionNotifications";
import { styles } from "@/screens/dashboard/HeaderBar.styles";
import { AppColors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  openMenu: () => void;
  isOpen: boolean;
};

export default function HeaderBar({ openMenu, isOpen }: Props) {

  const router = useRouter();
  const { profile } = useProfile();
  const { hasUnreadTransactions } = useTransactionNotifications();

  const avatar = profile?.avatar;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>

        <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
          <Ionicons
            name={isOpen ? "close" : "menu"}
            size={26}
            color={AppColors.text.primary}
          />
        </TouchableOpacity>

        <View style={styles.rightSection}>

          <TouchableOpacity
            style={styles.notification}
            onPress={() => router.push("/payment-history")}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={AppColors.text.primary}
            />
            {hasUnreadTransactions ? <View style={styles.notificationDot} /> : null}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push("/profile")}
          >
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            ) : (
              <Ionicons name="person" size={20} color="#fff" />
            )}
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}
