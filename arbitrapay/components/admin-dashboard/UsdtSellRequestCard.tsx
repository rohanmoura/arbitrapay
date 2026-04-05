import { styles } from "@/screens/admin-dashboard/SecurityDeposistsRequests.styles";
import { getProfileDisplayName } from "@/services/profileService";
import { getUsdtSellProofUrl } from "@/services/usdtSellService";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Alert, Image, Linking, Text, TouchableOpacity, View } from "react-native";

export type UsdtSellCardItem = {
  id: string;
  amountUsdt: number;
  transactionHash: string;
  screenshotUrl: string;
  createdAt: string | null;
  user: {
    avatar: string | null;
    email: string | null;
    name: string | null;
  };
};

function formatUsdtAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 8,
  }).format(amount);
}

function formatDate(value?: string | null) {
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

  return `${datePart} (${timePart})`;
}

function maskHash(hash?: string | null) {
  if (!hash) {
    return "Not available";
  }

  if (hash.length <= 16) {
    return hash;
  }

  return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
}

export const UsdtSellRequestCard = memo(function UsdtSellRequestCard({
  item,
}: {
  item: UsdtSellCardItem;
}) {
  const displayName = getProfileDisplayName(item.user.name);
  const avatarCharacter = displayName.charAt(0).toUpperCase() || "U";

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

        <View style={styles.amountWrap}>
          <Text style={styles.amount}>$ {formatUsdtAmount(item.amountUsdt)}</Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.methodRow}>
        <View style={styles.methodChip}>
          <Ionicons name="logo-bitcoin" size={12} color="#A78BFA" />
          <Text style={styles.methodText}>USDT Sell</Text>
        </View>

        <View style={[styles.badge, styles.approvedBadge]}>
          <Text style={styles.badgeText}>Approved</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="receipt-outline" size={14} color="#94A3B8" />
          <Text style={styles.detail}>Hash: {maskHash(item.transactionHash)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="image-outline" size={14} color="#94A3B8" />
          <Text style={styles.detail}>Receipt uploaded</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => {
            if (!item.screenshotUrl) {
              Alert.alert("Receipt", "Receipt not available.");
              return;
            }

            void getUsdtSellProofUrl(item.screenshotUrl)
              .then((url) => Linking.openURL(url))
              .catch((error: any) => {
                Alert.alert(
                  "Receipt Error",
                  error?.message || "Unable to open receipt."
                );
              });
          }}
        >
          <View style={styles.btnInner}>
            <Ionicons name="open-outline" size={14} color="#A5B4FC" />
            <Text style={styles.viewText}>Open Receipt</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});
