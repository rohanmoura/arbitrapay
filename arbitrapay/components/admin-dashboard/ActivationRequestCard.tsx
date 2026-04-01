import { styles } from "@/screens/admin-dashboard/BankAccounts.styles";
import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type ActivationRequestCardItem = {
  id: string;
  accountHolderName: string | null;
  accountNumber: string;
  createdAt: string | null;
  status: "approved" | "pending" | "rejected";
  user: {
    id?: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
  };
};

function formatCreatedAt(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  const datePart = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart}, (${timePart})`;
}

function maskAccountNumber(accountNumber: string) {
  return `**** **** **** ${accountNumber.slice(-4)}`;
}

type ActivationRequestCardProps = {
  item: ActivationRequestCardItem;
  onView: (item: ActivationRequestCardItem) => void;
  actionLabel?: string;
};

export const ActivationRequestCard = memo(function ActivationRequestCard({
  item,
  onView,
  actionLabel = "View",
}: ActivationRequestCardProps) {
  const [showFull, setShowFull] = useState(false);
  const displayName = item.user.name?.trim() || "User";
  const avatarCharacter = displayName.charAt(0).toUpperCase() || "U";
  const isActivated = item.status === "approved";
  const badgeStyle = isActivated ? styles.active : styles.suspended;

  const handleView = useCallback(() => {
    onView(item);
  }, [item, onView]);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          {item.user.avatar ? (
            <Image source={{ uri: item.user.avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{avatarCharacter}</Text>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{item.user.email || "Not available"}</Text>
        </View>

        <View style={[styles.badge, badgeStyle]}>
          <Text style={styles.badgeText}>
            {isActivated ? "Activated" : "Not Activated"}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={14} color="#94A3B8" />
          <Text style={styles.detail}>
            Holder: {item.accountHolderName?.trim() || displayName}
          </Text>
        </View>

        <View style={styles.accountRow}>
          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={14} color="#94A3B8" />
            <Text style={styles.detail}>
              Acc: {showFull ? item.accountNumber : maskAccountNumber(item.accountNumber)}
            </Text>
          </View>

          <TouchableOpacity onPress={() => setShowFull((current) => !current)}>
            <Ionicons
              name={showFull ? "eye-off-outline" : "eye-outline"}
              size={16}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
          <Text style={styles.detail}>Created: {formatCreatedAt(item.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View />

        <TouchableOpacity style={styles.viewBtn} onPress={handleView}>
          <Text style={styles.viewText}>{actionLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
