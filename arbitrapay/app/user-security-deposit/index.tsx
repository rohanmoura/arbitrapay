import FullScreenLoader from "@/components/FullScreenLoader";
import {
  SecurityDepositRequestCard,
  formatSecurityDepositAmount,
  formatSecurityDepositDate,
  formatSecurityDepositMethod,
  getSecurityDepositCardTab,
  type SecurityDepositCardTab,
} from "@/components/admin-dashboard/SecurityDepositRequestCard";
import { useAdminUserSecurityDeposit } from "@/hooks/useAdminUserSecurityDeposit";
import { styles } from "@/screens/admin-dashboard/UserSecurityDeposit.styles";
import { Ionicons } from "@expo/vector-icons";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function maskAccountNumber(accountNumber?: string | null) {
  if (!accountNumber) {
    return "Bank details not provided";
  }

  return `**** **** **** ${accountNumber.slice(-4)}`;
}

export default function UserSecurityDeposit() {
  const params = useLocalSearchParams<{
    depositId?: string | string[];
    tab?: SecurityDepositCardTab | SecurityDepositCardTab[];
  }>();
  const resolvedDepositId = useMemo(
    () => (Array.isArray(params.depositId) ? params.depositId[0] : params.depositId),
    [params.depositId]
  );
  const requestedTab = useMemo(() => {
    const value = Array.isArray(params.tab) ? params.tab[0] : params.tab;

    if (value === "approved" || value === "pending" || value === "new") {
      return value;
    }

    return "new" as SecurityDepositCardTab;
  }, [params.tab]);
  const {
    loading,
    selectedDeposit,
    otherDeposits,
    totalDeposits,
    showAccountNumber,
    previewVisible,
    toast,
    utrCopied,
    actionDepositId,
    actionStatus,
    setShowAccountNumber,
    setPreviewVisible,
    copyUtr,
    approveDeposit,
    markDepositPending,
  } = useAdminUserSecurityDeposit(resolvedDepositId);

  useEffect(() => {
    if (typeof resolvedDepositId !== "undefined") {
      return;
    }

    Alert.alert("Security Deposit Error", "No security deposit was selected.");
    router.back();
  }, [resolvedDepositId]);

  useEffect(() => {
    if (loading || !resolvedDepositId || selectedDeposit) {
      return;
    }

    Alert.alert("Security Deposit Error", "Unable to find this security deposit.");
    router.back();
  }, [loading, resolvedDepositId, selectedDeposit]);

  const displayName =
    !selectedDeposit?.user.name?.trim() || selectedDeposit.user.name.trim() === "User"
      ? "User"
      : selectedDeposit.user.name.trim();
  const avatarCharacter = displayName.charAt(0).toUpperCase() || "U";
  const currentTab = selectedDeposit
    ? getSecurityDepositCardTab({
        status: selectedDeposit.status,
        verifiedAt: selectedDeposit.verifiedAt,
        verifiedBy: selectedDeposit.verifiedBy,
      })
    : requestedTab;
  const accountNumberLabel = showAccountNumber
    ? selectedDeposit?.bankAccount?.accountNumber || "Bank details not provided"
    : maskAccountNumber(selectedDeposit?.bankAccount?.accountNumber);
  const isUpdatingMain = actionDepositId === selectedDeposit?.id;

  const handleViewDeposit = (depositId: string, tab: SecurityDepositCardTab) => {
    router.replace(
      `/user-security-deposit?depositId=${depositId}&tab=${tab}` as Href
    );
  };

  const handleViewBank = () => {
    if (!selectedDeposit?.userId) {
      return;
    }

    router.push(`/user-bank-account?userId=${selectedDeposit.userId}` as Href);
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!selectedDeposit) {
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

          <Text style={styles.headerTitle}>User Security Deposit</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.userCard}>
          <View style={styles.avatarLarge}>
            {selectedDeposit.user.avatar ? (
              <Image source={{ uri: selectedDeposit.user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{avatarCharacter}</Text>
            )}
          </View>

          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{selectedDeposit.user.email || "Not available"}</Text>
          <Text style={styles.userMeta}>
            {totalDeposits} Deposit{totalDeposits === 1 ? "" : "s"}
          </Text>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.amountBig}>
                ₹ {formatSecurityDepositAmount(selectedDeposit.amount)}
              </Text>
              <Text style={styles.date}>
                {formatSecurityDepositDate(selectedDeposit.createdAt)}
              </Text>
            </View>

            {currentTab !== "new" && (
              <View
                style={[
                  styles.badge,
                  currentTab === "approved" ? styles.approvedBadge : styles.pendingBadge,
                ]}
              >
                <Text style={styles.badgeText}>
                  {currentTab === "approved" ? "Approved" : "Pending"}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.methodRow}>
            <View style={styles.methodChip}>
              <Ionicons
                name={
                  selectedDeposit.depositMethod === "UPI"
                    ? "flash-outline"
                    : "card-outline"
                }
                size={12}
                color="#A78BFA"
              />
              <Text style={styles.methodText}>
                {formatSecurityDepositMethod(selectedDeposit.depositMethod)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.block}>
            <Text style={styles.sectionTitle}>Bank Details</Text>

            <Text style={styles.label}>Bank</Text>
            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={14} color="#94A3B8" />
              <Text style={styles.detail}>
                {selectedDeposit.bankAccount?.bankName || "Bank details not provided"}
              </Text>
            </View>

            <Text style={styles.label}>Account Holder</Text>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={14} color="#94A3B8" />
              <Text style={styles.detail}>
                {selectedDeposit.bankAccount?.accountHolderName || "Not available"}
              </Text>
            </View>

            <Text style={styles.label}>Account Number</Text>
            <View style={styles.accountRow}>
              <Text style={styles.detail}>{accountNumberLabel}</Text>

              <TouchableOpacity
                onPress={() => setShowAccountNumber((current) => !current)}
                disabled={!selectedDeposit.bankAccount?.accountNumber}
              >
                <Ionicons
                  name={showAccountNumber ? "eye-off-outline" : "eye-outline"}
                  size={16}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>IFSC Code</Text>
            <View style={styles.detailRow}>
              <Ionicons name="git-branch-outline" size={14} color="#94A3B8" />
              <Text style={styles.detail}>
                {selectedDeposit.bankAccount?.ifscCode || "Not available"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View>
            <Text style={styles.sectionTitle}>Deposit Details</Text>

            <View style={styles.utrRow}>
              <Text style={styles.detail}>
                UTR: {selectedDeposit.utrNumber || "Not available"}
              </Text>

              <TouchableOpacity onPress={() => void copyUtr()} disabled={!selectedDeposit.utrNumber}>
                <Ionicons
                  name={utrCopied ? "checkmark" : "copy-outline"}
                  size={16}
                  color={utrCopied ? "#22C55E" : "#94A3B8"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View>
            <Text style={styles.sectionTitle}>Payment Proof</Text>

            {selectedDeposit.paymentProofUrl ? (
              <TouchableOpacity onPress={() => setPreviewVisible(true)}>
                <View style={styles.proofWrap}>
                  <Image
                    source={{ uri: selectedDeposit.paymentProofUrl }}
                    style={styles.proofImage}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyProof}>
                <Text style={styles.emptyProofText}>Payment proof not available.</Text>
              </View>
            )}
          </View>

          <View style={styles.actionsWrap}>
            <View style={styles.actions}>
              {currentTab !== "approved" && (
                <TouchableOpacity
                  style={[
                    styles.approveBtn,
                    isUpdatingMain && actionStatus === "approved" && styles.disabledBtn,
                  ]}
                  disabled={isUpdatingMain}
                  onPress={() => void approveDeposit(selectedDeposit.id)}
                >
                  {isUpdatingMain && actionStatus === "approved" ? (
                    <ActivityIndicator size="small" color="#22C55E" />
                  ) : (
                    <Ionicons name="checkmark" size={14} color="#22C55E" />
                  )}
                  <Text style={styles.approveText}>Approve</Text>
                </TouchableOpacity>
              )}

              {currentTab !== "pending" && (
                <TouchableOpacity
                  style={[
                    styles.pendingBtn,
                    isUpdatingMain && actionStatus === "pending" && styles.disabledBtn,
                  ]}
                  disabled={isUpdatingMain}
                  onPress={() => void markDepositPending(selectedDeposit.id)}
                >
                  {isUpdatingMain && actionStatus === "pending" ? (
                    <ActivityIndicator size="small" color="#FBBF24" />
                  ) : (
                    <Ionicons name="time-outline" size={14} color="#FBBF24" />
                  )}
                  <Text style={styles.pendingText}>Pending</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.viewBtn} onPress={handleViewBank}>
                <Ionicons name="eye-outline" size={14} color="#A5B4FC" />
                <Text style={styles.viewText}>View Bank</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {totalDeposits > 1 && otherDeposits.length > 0 && (
          <View style={styles.otherWrap}>
            <Text style={styles.otherTitle}>Other Deposits</Text>

            <View style={styles.otherList}>
              {otherDeposits.map((deposit) => (
                <SecurityDepositRequestCard
                  key={deposit.id}
                  item={deposit}
                  tab={getSecurityDepositCardTab({
                    status: deposit.status,
                    verifiedAt: deposit.verifiedAt,
                    verifiedBy: deposit.verifiedBy,
                  })}
                  actionDepositId={actionDepositId}
                  actionStatus={actionStatus}
                  onApprove={approveDeposit}
                  onPending={markDepositPending}
                  onView={handleViewDeposit}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <Modal visible={previewVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setPreviewVisible(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {selectedDeposit.paymentProofUrl ? (
            <Image
              source={{ uri: selectedDeposit.paymentProofUrl }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          ) : null}
        </View>
      </Modal>

      {toast !== "" && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
