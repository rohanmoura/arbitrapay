import { useAuth } from "@/contexts/AuthContext";
import {
  fetchAdminUserWithdrawalDetail,
  type AdminUserWithdrawalRecord,
} from "@/services/adminWithdrawalDetailsService";
import {
  type AdminWithdrawalStatus,
  updateAdminWithdrawalStatus,
} from "@/services/adminWithdrawalsService";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

function updateLocalStatus(
  withdrawals: AdminUserWithdrawalRecord[],
  withdrawalId: string,
  status: AdminWithdrawalStatus,
  adminId: string,
  timestamp: string
): AdminUserWithdrawalRecord[] {
  return withdrawals.map((withdrawal) =>
    withdrawal.id === withdrawalId
      ? {
          ...withdrawal,
          status,
          verifiedBy: adminId,
          verifiedAt: timestamp,
        }
      : withdrawal
  );
}

export function useAdminWithdrawalDetails(withdrawalId?: string) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<AdminUserWithdrawalRecord | null>(null);
  const [userWithdrawals, setUserWithdrawals] = useState<AdminUserWithdrawalRecord[]>([]);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [toast, setToast] = useState("");
  const [actionWithdrawalId, setActionWithdrawalId] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<AdminWithdrawalStatus | null>(null);
  const [totalDepositedAmount, setTotalDepositedAmount] = useState(0);

  const loadWithdrawal = useCallback(async () => {
    if (!withdrawalId) {
      setSelectedWithdrawal(null);
      setUserWithdrawals([]);
      setTotalDepositedAmount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchAdminUserWithdrawalDetail(withdrawalId);

      if (!response) {
        setSelectedWithdrawal(null);
        setUserWithdrawals([]);
        setTotalDepositedAmount(0);
        return;
      }

      setSelectedWithdrawal(response.selectedWithdrawal);
      setUserWithdrawals(response.userWithdrawals);
      setTotalDepositedAmount(response.totalDepositedAmount);
      setShowAccountNumber(false);
    } catch (error: any) {
      Alert.alert(
        "Withdrawal Error",
        error.message || "Unable to load this withdrawal right now."
      );
      setSelectedWithdrawal(null);
      setUserWithdrawals([]);
      setTotalDepositedAmount(0);
    } finally {
      setLoading(false);
    }
  }, [withdrawalId]);

  useEffect(() => {
    void loadWithdrawal();
  }, [loadWithdrawal]);

  const totalWithdrawals = useMemo(
    () => new Set(userWithdrawals.map((withdrawal) => withdrawal.id)).size,
    [userWithdrawals]
  );

  const otherWithdrawals = useMemo(
    () => userWithdrawals.filter((withdrawal) => withdrawal.id !== selectedWithdrawal?.id),
    [selectedWithdrawal?.id, userWithdrawals]
  );

  const showToast = useCallback((message: string) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2000);
  }, []);

  const updateStatus = useCallback(
    async (targetWithdrawalId: string, status: AdminWithdrawalStatus) => {
      if (!profile?.id || actionWithdrawalId) {
        return;
      }

      const previousSelected = selectedWithdrawal;
      const previousWithdrawals = userWithdrawals;
      const timestamp = new Date().toISOString();

      setActionWithdrawalId(targetWithdrawalId);
      setActionStatus(status);

      const optimisticWithdrawals = updateLocalStatus(
        userWithdrawals,
        targetWithdrawalId,
        status,
        profile.id,
        timestamp
      );

      setUserWithdrawals(optimisticWithdrawals);
      setSelectedWithdrawal(
        optimisticWithdrawals.find((withdrawal) => withdrawal.id === selectedWithdrawal?.id) ||
          previousSelected
      );

      try {
        const updated = await updateAdminWithdrawalStatus({
          withdrawalId: targetWithdrawalId,
          adminId: profile.id,
          status,
        });

        const syncedWithdrawals: AdminUserWithdrawalRecord[] = optimisticWithdrawals.map(
          (withdrawal) =>
            withdrawal.id === targetWithdrawalId
              ? {
                  ...withdrawal,
                  status: updated.status as AdminUserWithdrawalRecord["status"],
                  verifiedBy: updated.verifiedBy,
                  verifiedAt: updated.verifiedAt,
                }
              : withdrawal
        );

        setUserWithdrawals(syncedWithdrawals);
        setSelectedWithdrawal(
          syncedWithdrawals.find((withdrawal) => withdrawal.id === selectedWithdrawal?.id) ||
            previousSelected
        );
      } catch (error: any) {
        setUserWithdrawals(previousWithdrawals);
        setSelectedWithdrawal(previousSelected);
        Alert.alert(
          "Update Error",
          error.message || "Unable to update this withdrawal request."
        );
      } finally {
        setActionWithdrawalId(null);
        setActionStatus(null);
      }
    },
    [actionWithdrawalId, profile?.id, selectedWithdrawal, userWithdrawals]
  );

  return {
    loading,
    selectedWithdrawal,
    otherWithdrawals,
    totalWithdrawals,
    totalDepositedAmount,
    showAccountNumber,
    toast,
    actionWithdrawalId,
    actionStatus,
    setShowAccountNumber,
    approveWithdrawal: (targetWithdrawalId: string) => updateStatus(targetWithdrawalId, "approved"),
    markWithdrawalPending: (targetWithdrawalId: string) => updateStatus(targetWithdrawalId, "pending"),
    reloadWithdrawal: loadWithdrawal,
    showToast,
  };
}
