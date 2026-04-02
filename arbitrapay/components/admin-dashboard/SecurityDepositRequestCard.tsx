import { styles } from "@/screens/admin-dashboard/SecurityDeposistsRequests.styles";
import { getProfileDisplayName } from "@/services/profileService";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type SecurityDepositCardTab = "new" | "approved" | "pending";

export type SecurityDepositCardItem = {
  id: string;
  userId: string;
  depositMethod: "UPI" | "BANK_TRANSFER";
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
    bankName: string | null;
    accountNumber: string | null;
  } | null;
};

const TAB_LABELS: Record<Exclude<SecurityDepositCardTab, "new">, string> = {
  approved: "Approved",
  pending: "Pending",
};

export function isNewSecurityDepositCard(
  item: Pick<SecurityDepositCardItem, "status" | "verifiedAt" | "verifiedBy">
) {
  return item.status === "pending" && !item.verifiedAt && !item.verifiedBy;
}

export function getSecurityDepositCardTab(
  item: Pick<SecurityDepositCardItem, "status" | "verifiedAt" | "verifiedBy">
): SecurityDepositCardTab {
  if (item.status === "approved") {
    return "approved";
  }

  if (item.status === "pending" && !isNewSecurityDepositCard(item)) {
    return "pending";
  }

  return "new";
}

export function maskSecurityDepositAccountNumber(accountNumber?: string | null) {
  if (!accountNumber) {
    return "Bank details not provided";
  }

  return `**** **** **** ${accountNumber.slice(-4)}`;
}

export function formatSecurityDepositAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatSecurityDepositDate(value?: string | null) {
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

export function formatSecurityDepositMethod(method: "UPI" | "BANK_TRANSFER") {
  return method === "BANK_TRANSFER" ? "Bank Transfer" : "UPI";
}

type SecurityDepositRequestCardProps = {
  item: SecurityDepositCardItem;
  tab: SecurityDepositCardTab;
  actionDepositId: string | null;
  actionStatus: "approved" | "pending" | null;
  onApprove: (depositId: string) => void;
  onPending: (depositId: string) => void;
  onView: (depositId: string, tab: SecurityDepositCardTab) => void;
};

export const SecurityDepositRequestCard = memo(function SecurityDepositRequestCard({
  item,
  tab,
  actionDepositId,
  actionStatus,
  onApprove,
  onPending,
  onView,
}: SecurityDepositRequestCardProps) {
  const displayName = getProfileDisplayName(item.user.name);
  const avatarCharacter = displayName.charAt(0).toUpperCase() || "U";
  const bankName = item.bankAccount?.bankName?.trim() || "Bank details not provided";
  const accountNumberLabel = item.bankAccount?.accountNumber
    ? maskSecurityDepositAccountNumber(item.bankAccount.accountNumber)
    : "Bank details not provided";
  const isUpdating = actionDepositId === item.id;

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
          <Text style={styles.amount}>₹ {formatSecurityDepositAmount(item.amount)}</Text>
          <Text style={styles.date}>{formatSecurityDepositDate(item.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.methodRow}>
        <View style={styles.methodChip}>
          <Ionicons
            name={item.depositMethod === "UPI" ? "flash-outline" : "card-outline"}
            size={12}
            color="#A78BFA"
          />
          <Text style={styles.methodText}>
            {formatSecurityDepositMethod(item.depositMethod)}
          </Text>
        </View>

        {tab !== "new" && (
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
          <Ionicons name="card-outline" size={14} color="#94A3B8" />
          <Text style={styles.detail}>{accountNumberLabel}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {tab !== "approved" && (
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

        {tab !== "pending" && (
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
