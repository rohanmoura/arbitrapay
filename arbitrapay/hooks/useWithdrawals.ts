import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "@/contexts/AuthContext";
import {
  createWithdrawalRequest,
  fetchWithdrawalBankAccounts,
  makeWithdrawalBankAccountPrimary,
  type WithdrawalBankAccount,
} from "@/services/withdrawalService";
import { sortBankAccounts } from "@/services/bankAccountService";

const AVAILABLE_BALANCE = 24850;
const MINIMUM_WITHDRAWAL = 500;
const MAXIMUM_WITHDRAWAL = 50000;

export function useWithdrawals() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingPrimary, setUpdatingPrimary] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState<WithdrawalBankAccount[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const numericAmount = Number(amount || 0);
  const isValidAmount =
    numericAmount >= MINIMUM_WITHDRAWAL &&
    numericAmount <= MAXIMUM_WITHDRAWAL &&
    numericAmount <= AVAILABLE_BALANCE;

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast("");
    }, 2000);
  }, []);

  const loadAccounts = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const bankAccounts = await fetchWithdrawalBankAccounts(session.user.id);
      setAccounts(bankAccounts);

      if (bankAccounts.length === 0) {
        setSelectedBankId(null);
      } else {
        const nextSelectedBankId =
          selectedBankId && bankAccounts.some((account) => account.id === selectedBankId)
            ? selectedBankId
            : bankAccounts[0].id;
        setSelectedBankId(nextSelectedBankId);
      }
    } catch (error: any) {
      Alert.alert(
        "Withdrawal Error",
        error.message || "Unable to load bank accounts."
      );
      setAccounts([]);
      setSelectedBankId(null);
    } finally {
      setLoading(false);
    }
  }, [selectedBankId, session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
    }, [loadAccounts])
  );

  const selectBankAccount = useCallback(
    async (bankAccountId: string) => {
      if (!session?.user?.id || updatingPrimary || submitting) {
        return;
      }

      const selectedAccount = accounts.find((account) => account.id === bankAccountId);

      if (!selectedAccount) {
        return;
      }

      setSelectedBankId(bankAccountId);

      if (selectedAccount.is_default) {
        return;
      }

      setUpdatingPrimary(bankAccountId);

      try {
        await makeWithdrawalBankAccountPrimary(session.user.id, bankAccountId);
        setAccounts((current) =>
          sortBankAccounts(
            current.map((account) => ({
              ...account,
              is_default: account.id === bankAccountId,
            }))
          )
        );
      } catch (error: any) {
        Alert.alert(
          "Primary Account Error",
          error.message || "Unable to update the primary bank account."
        );
      } finally {
        setUpdatingPrimary(null);
      }
    },
    [accounts, session?.user?.id, submitting, updatingPrimary]
  );

  const submitWithdrawal = useCallback(async () => {
    if (!session?.user?.id || submitting) {
      return;
    }

    if (!selectedBankId) {
      Alert.alert("Bank Account Required", "Please select a bank account.");
      return;
    }

    if (!amount || !isValidAmount) {
      Alert.alert(
        "Invalid Amount",
        "Withdrawal amount must be between ₹500 and ₹50,000 and within your available balance."
      );
      return;
    }

    setSubmitting(true);

    try {
      await createWithdrawalRequest({
        userId: session.user.id,
        bankAccountId: selectedBankId,
        amount: numericAmount,
      });

      setAmount("");
      showToast("Withdrawal request submitted");
    } catch (error: any) {
      Alert.alert(
        "Withdrawal Error",
        error.message || "Unable to submit withdrawal request."
      );
    } finally {
      setSubmitting(false);
    }
  }, [amount, isValidAmount, numericAmount, selectedBankId, session?.user?.id, showToast, submitting]);

  return {
    loading,
    submitting,
    updatingPrimary,
    toast,
    amount,
    setAmount,
    accounts,
    selectedBankId,
    selectedAccount:
      accounts.find((account) => account.id === selectedBankId) || null,
    availableBalance: AVAILABLE_BALANCE,
    minimumWithdrawal: MINIMUM_WITHDRAWAL,
    maximumWithdrawal: MAXIMUM_WITHDRAWAL,
    isValidAmount,
    selectBankAccount,
    submitWithdrawal,
  };
}
