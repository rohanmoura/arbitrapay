import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "@/contexts/AuthContext";
import {
  fetchPaymentHistoryData,
  type PaymentHistorySummary,
} from "@/services/paymentHistoryService";

const EMPTY_SUMMARY: PaymentHistorySummary = {
  totalDeposits: 0,
  totalWithdrawals: 0,
  pendingTransactions: 0,
  currentBalance: 0,
  pendingWithdrawals: 0,
  totalBankAccounts: 0,
  verifiedBankAccounts: 0,
};

export function useFinancialSummary() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PaymentHistorySummary>(EMPTY_SUMMARY);

  const loadSummary = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      setSummary(EMPTY_SUMMARY);
      return;
    }

    setLoading(true);

    try {
      const result = await fetchPaymentHistoryData(session.user.id);
      setSummary(result.summary);
    } catch (error: any) {
      Alert.alert(
        "Balance Error",
        error.message || "Unable to load your wallet summary."
      );
      setSummary(EMPTY_SUMMARY);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadSummary();
    }, [loadSummary])
  );

  return {
    loading,
    summary,
    refreshSummary: loadSummary,
  };
}
