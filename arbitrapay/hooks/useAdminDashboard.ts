import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import {
  calculateAdminDashboardBalance,
  fetchAdminDashboardData,
  type AdminDashboardData,
} from "@/services/adminDashboardService";
import { updateAdminBalance } from "@/services/adminSettingsService";

const EMPTY_DASHBOARD: AdminDashboardData = {
  balance: {
    defaultBalance: 0,
    approvedSecurityDeposits: 0,
    approvedWithdrawals: 0,
    liveDepositCredit: 0,
    liveDepositDebit: 0,
    currentBalance: 0,
  },
  insights: {
    totalUsers: 0,
    totalBankAccounts: 0,
    totalActivationRequests: 0,
    usersWithLiveDeposits: 0,
    totalSecurityDeposits: 0,
    totalWithdrawalRequests: 0,
  },
};

export function useAdminDashboard() {
  const [dashboard, setDashboard] = useState<AdminDashboardData>(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [savingBalance, setSavingBalance] = useState(false);

  const loadDashboard = useCallback(async () => {
    const data = await fetchAdminDashboardData();
    setDashboard(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const run = async () => {
        try {
          setLoading(true);
          const data = await fetchAdminDashboardData();

          if (!active) {
            return;
          }

          setDashboard(data);
        } catch (error: any) {
          if (active) {
            Alert.alert(
              "Admin Dashboard Error",
              error.message || "Unable to load dashboard insights right now."
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      void run();

      return () => {
        active = false;
      };
    }, [])
  );

  const saveBalance = useCallback(
    async (nextDefaultBalance: number) => {
      if (savingBalance) {
        return false;
      }

      setSavingBalance(true);

      try {
        const updated = await updateAdminBalance({
          adminBalance: nextDefaultBalance,
        });

        setDashboard((current) => {
          const nextBalance = {
            ...current.balance,
            defaultBalance: updated.adminBalance,
          };

          return {
            ...current,
            balance: {
              ...nextBalance,
              currentBalance: calculateAdminDashboardBalance({
                defaultBalance: nextBalance.defaultBalance,
                approvedSecurityDeposits: nextBalance.approvedSecurityDeposits,
                approvedWithdrawals: nextBalance.approvedWithdrawals,
                liveDepositCredit: nextBalance.liveDepositCredit,
                liveDepositDebit: nextBalance.liveDepositDebit,
              }),
            },
          };
        });

        return true;
      } catch (error: any) {
        Alert.alert(
          "Save Error",
          error.message || "Unable to save admin balance."
        );
        return false;
      } finally {
        setSavingBalance(false);
      }
    },
    [savingBalance]
  );

  return {
    loading,
    savingBalance,
    dashboard,
    saveBalance,
    reloadDashboard: loadDashboard,
  };
}
