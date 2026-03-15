import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "@/contexts/AuthContext";
import {
  ApprovedLiveDepositAccount,
  fetchApprovedLiveDepositAccounts,
  fetchLiveDeposits,
  LiveDepositRecord,
} from "@/services/liveDepositService";

export function useLiveDeposits() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<ApprovedLiveDepositAccount[]>([]);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string | null>(null);
  const [deposits, setDeposits] = useState<LiveDepositRecord[]>([]);
  const [visibleDepositId, setVisibleDepositId] = useState<string | null>(null);

  const loadLiveDeposits = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const approvedAccounts = await fetchApprovedLiveDepositAccounts(session.user.id);
      setAccounts(approvedAccounts);

      if (approvedAccounts.length === 0) {
        setSelectedBankAccountId(null);
        setDeposits([]);
        return;
      }

      const nextSelectedBankAccountId =
        selectedBankAccountId &&
        approvedAccounts.some((account) => account.bankAccountId === selectedBankAccountId)
          ? selectedBankAccountId
          : approvedAccounts[0].bankAccountId;

      setSelectedBankAccountId(nextSelectedBankAccountId);

      const liveDepositRows = await fetchLiveDeposits(
        session.user.id,
        nextSelectedBankAccountId
      );

      setDeposits(liveDepositRows);
    } catch (error: any) {
      Alert.alert(
        "Live Deposit Error",
        error.message || "Unable to load live deposits."
      );
      setAccounts([]);
      setSelectedBankAccountId(null);
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBankAccountId, session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadLiveDeposits();
    }, [loadLiveDeposits])
  );

  const selectAccount = useCallback(
    async (bankAccountId: string) => {
      if (!session?.user?.id || bankAccountId === selectedBankAccountId) {
        return;
      }

      setLoading(true);

      try {
        const liveDepositRows = await fetchLiveDeposits(session.user.id, bankAccountId);
        setSelectedBankAccountId(bankAccountId);
        setDeposits(liveDepositRows);
        setVisibleDepositId(null);
      } catch (error: any) {
        Alert.alert(
          "Live Deposit Error",
          error.message || "Unable to switch live deposit account."
        );
      } finally {
        setLoading(false);
      }
    },
    [selectedBankAccountId, session?.user?.id]
  );

  return {
    loading,
    accounts,
    selectedBankAccountId,
    deposits,
    visibleDepositId,
    setVisibleDepositId,
    selectAccount,
  };
}
