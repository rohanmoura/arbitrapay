import { styles } from "@/screens/dashboard/HeaderBar.styles";
import { AppColors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  openMenu: () => void;
  isOpen: boolean;
};

export default function HeaderBar({ openMenu, isOpen }: Props) {
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

          <TouchableOpacity style={styles.notification}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={AppColors.text.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.avatar}>
            <Ionicons name="person" size={20} color="#fff" />
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}