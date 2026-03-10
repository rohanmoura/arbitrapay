import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/screens/dashboard/RequestSection.styles";
import { AppColors } from "@/theme/colors";

type Props = {
  title: string;
  count?: number;
};

export default function RequestSection({ title, count = 0 }: Props) {
  return (
    <View style={styles.card}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {title} {count !== undefined ? `- (${count})` : ""}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* EMPTY STATE */}
      <View style={styles.empty}>
        <Ionicons
          name="archive-outline"
          size={36}
          color={AppColors.text.secondary}
          style={{ opacity: 0.6 }}
        />
        <Text style={styles.emptyText}>No data available</Text>
      </View>

    </View>
  );
}