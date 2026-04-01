import { styles } from "@/screens/admin-dashboard/WithdrawalsRequests.styles";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type WithdrawalCardTab = "total" | "approved" | "pending";

export type WithdrawalCardItem = {
  id: string;
  userId: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
  user: {
    avatar: string | null;
    email: string | null;
    name: string | null;
  };
  bankAccount: {
    id: string;
    bankName: string | null;
    accountHolderName: string | null;
    accountNumber: string | null;
    ifscCode: string | null;
  } | null;
};

const TAB_LABELS: Record<Exclude<WithdrawalCardTab, "total">, string> = {
  approved: "Approved",
  pending: "Pending",
};

export function maskWithdrawalAccountNumber(accountNumber?: string | null) {
  if (!accountNumber) {
    return "Bank details not provided";
  }

  return `**** **** **** ${accountNumber.slice(-4)}`;
}

export function formatWithdrawalAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatWithdrawalDate(value?: string | null) {
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

type WithdrawalRequestCardProps = {
  item: WithdrawalCardItem;
  tab: WithdrawalCardTab;
  actionWithdrawalId: string | null;
  actionStatus: "approved" | "pending" | null;
  onApprove: (withdrawalId: string) => void;
  onPending: (withdrawalId: string) => void;
  onView: (withdrawalId: string, tab: WithdrawalCardTab) => void;
};

export const WithdrawalRequestCard = memo(function WithdrawalRequestCard({
  item,
  tab,
  actionWithdrawalId,
  actionStatus,
  onApprove,
  onPending,
  onView,
}: WithdrawalRequestCardProps) {
  const displayName =
    !item.user.name?.trim() || item.user.name.trim() === "User"
      ? "User"
      : item.user.name.trim();
  const avatarCharacter = displayName.charAt(0).toUpperCase() || "U";
  const bankName = item.bankAccount?.bankName?.trim() || "Bank details not provided";
  const holderName = item.bankAccount?.accountHolderName?.trim() || "Not available";
  const accountNumberLabel = item.bankAccount?.accountNumber
    ? maskWithdrawalAccountNumber(item.bankAccount.accountNumber)
    : "Bank details not provided";
  const isUpdating = actionWithdrawalId === item.id;

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
          <Text style={styles.amount}>₹ {formatWithdrawalAmount(item.amount)}</Text>
          <Text style={styles.date}>{formatWithdrawalDate(item.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.methodRow}>
        <View />

        {tab !== "total" && (
          <View
            style={[
              styles.badge,
              tab === "approved" ? styles.approvedBadge : styles.pendingBadge,
            ]}
          >
            <Text style={styles.badgeText}>{TAB_LABELS[tab]}</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={14} color="#94A3B8" />
          <Text style={styles.detail}>{bankName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={14} color="#94A3B8" />
          <Text style={styles.detail}>{holderName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={14} color="#94A3B8" />
          <Text style={styles.detail}>{accountNumberLabel}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {item.status !== "approved" && (
          <TouchableOpacity
            style={[
              styles.approveBtn,
              isUpdating && actionStatus === "approved" && styles.disabledBtn,
            ]}
            disabled={isUpdating}
            onPress={() => onApprove(item.id)}
          >
            <View style={styles.btnInner}>
              {isUpdating && actionStatus === "approved" ? (
                <ActivityIndicator size="small" color="#22C55E" />
              ) : (
                <Ionicons name="checkmark" size={14} color="#22C55E" />
              )}
              <Text style={styles.approveText}>Approve</Text>
            </View>
          </TouchableOpacity>
        )}

        {item.status !== "pending" && (
          <TouchableOpacity
            style={[
              styles.pendingBtn,
              isUpdating && actionStatus === "pending" && styles.disabledBtn,
            ]}
            disabled={isUpdating}
            onPress={() => onPending(item.id)}
          >
            <View style={styles.btnInner}>
              {isUpdating && actionStatus === "pending" ? (
                <ActivityIndicator size="small" color="#FBBF24" />
              ) : (
                <Ionicons name="time-outline" size={14} color="#FBBF24" />
              )}
              <Text style={styles.pendingText}>Pending</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.viewBtn} onPress={() => onView(item.id, tab)}>
          <View style={styles.btnInner}>
            <Ionicons name="eye-outline" size={14} color="#A5B4FC" />
            <Text style={styles.viewText}>View</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});
