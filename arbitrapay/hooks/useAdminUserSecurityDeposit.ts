import { useAuth } from "@/contexts/AuthContext";
import {
  fetchAdminUserSecurityDepositDetail,
  type AdminUserSecurityDepositRecord,
} from "@/services/adminUserSecurityDepositService";
import {
  type AdminSecurityDepositStatus,
  updateAdminSecurityDepositStatus,
} from "@/services/adminSecurityDepositsService";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

function updateLocalStatus(
  deposits: AdminUserSecurityDepositRecord[],
  depositId: string,
  status: AdminSecurityDepositStatus,
  adminId: string,
  timestamp: string
): AdminUserSecurityDepositRecord[] {
  return deposits.map((deposit) =>
    deposit.id === depositId
      ? {
          ...deposit,
          status,
          verifiedBy: adminId,
          verifiedAt: timestamp,
        }
      : deposit
  );
}

export function useAdminUserSecurityDeposit(depositId?: string) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedDeposit, setSelectedDeposit] =
    useState<AdminUserSecurityDepositRecord | null>(null);
  const [userDeposits, setUserDeposits] = useState<AdminUserSecurityDepositRecord[]>([]);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [toast, setToast] = useState("");
  const [utrCopied, setUtrCopied] = useState(false);
  const [actionDepositId, setActionDepositId] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<AdminSecurityDepositStatus | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast("");
      setUtrCopied(false);
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const loadDeposit = useCallback(async () => {
    if (!depositId) {
      setSelectedDeposit(null);
      setUserDeposits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchAdminUserSecurityDepositDetail(depositId);

      if (!response) {
        setSelectedDeposit(null);
        setUserDeposits([]);
        return;
      }

      setSelectedDeposit(response.selectedDeposit);
      setUserDeposits(response.userDeposits);
      setShowAccountNumber(false);
      setPreviewVisible(false);
    } catch (error: any) {
      Alert.alert(
        "Security Deposit Error",
        error.message || "Unable to load this security deposit right now."
      );
      setSelectedDeposit(null);
      setUserDeposits([]);
    } finally {
      setLoading(false);
    }
  }, [depositId]);

  useEffect(() => {
    void loadDeposit();
  }, [loadDeposit]);

  const totalDeposits = useMemo(
    () => new Set(userDeposits.map((deposit) => deposit.id)).size,
    [userDeposits]
  );

  const otherDeposits = useMemo(
    () => userDeposits.filter((deposit) => deposit.id !== selectedDeposit?.id),
    [selectedDeposit?.id, userDeposits]
  );

  const copyUtr = useCallback(async () => {
    if (!selectedDeposit?.utrNumber) {
      return;
    }

    await Clipboard.setStringAsync(selectedDeposit.utrNumber);
    setUtrCopied(true);
    showToast("UTR copied");
  }, [selectedDeposit?.utrNumber, showToast]);

  const updateStatus = useCallback(
    async (targetDepositId: string, status: AdminSecurityDepositStatus) => {
      if (!profile?.id || actionDepositId) {
        return;
      }

      const previousSelected = selectedDeposit;
      const previousDeposits = userDeposits;
      const timestamp = new Date().toISOString();

      setActionDepositId(targetDepositId);
      setActionStatus(status);

      const optimisticDeposits = updateLocalStatus(
        userDeposits,
        targetDepositId,
        status,
        profile.id,
        timestamp
      );

      setUserDeposits(optimisticDeposits);
      setSelectedDeposit(
        optimisticDeposits.find((deposit) => deposit.id === selectedDeposit?.id) ||
          previousSelected
      );

      try {
        const updated = await updateAdminSecurityDepositStatus({
          depositId: targetDepositId,
          adminId: profile.id,
          status,
        });

        const syncedDeposits: AdminUserSecurityDepositRecord[] = optimisticDeposits.map((deposit) =>
          deposit.id === targetDepositId
            ? {
                ...deposit,
                status: updated.status as AdminUserSecurityDepositRecord["status"],
                verifiedBy: updated.verifiedBy,
                verifiedAt: updated.verifiedAt,
              }
            : deposit
        );

        setUserDeposits(syncedDeposits);
        setSelectedDeposit(
          syncedDeposits.find((deposit) => deposit.id === selectedDeposit?.id) ||
            previousSelected
        );
      } catch (error: any) {
        setUserDeposits(previousDeposits);
        setSelectedDeposit(previousSelected);
        Alert.alert(
          "Update Error",
          error.message || "Unable to update this security deposit request."
        );
      } finally {
        setActionDepositId(null);
        setActionStatus(null);
      }
    },
    [actionDepositId, profile?.id, selectedDeposit, userDeposits]
  );

  return {
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
    approveDeposit: (targetDepositId: string) => updateStatus(targetDepositId, "approved"),
    markDepositPending: (targetDepositId: string) => updateStatus(targetDepositId, "pending"),
    reloadDeposit: loadDeposit,
  };
}
