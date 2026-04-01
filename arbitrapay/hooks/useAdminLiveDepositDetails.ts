import { useAuth } from "@/contexts/AuthContext";
import {
  createLiveDeposit,
  fetchAdminLiveDepositDetails,
  type AdminLiveDepositDetails,
  type AdminLiveDepositHistoryItem,
  type AdminLiveDepositTransactionType,
} from "@/services/adminLiveDepositDetailsService";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";

export function useAdminLiveDepositDetails(requestId?: string) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [details, setDetails] = useState<AdminLiveDepositDetails | null>(null);
  const [transactionType, setTransactionType] =
    useState<AdminLiveDepositTransactionType | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast("");
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const loadDetails = useCallback(async () => {
    if (!requestId) {
      setDetails(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchAdminLiveDepositDetails(requestId);
      setDetails(response);
      setShowAccountNumber(false);
    } catch (error: any) {
      Alert.alert(
        "Live Deposit Error",
        error.message || "Unable to load this live deposit screen right now."
      );
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  const history = useMemo<AdminLiveDepositHistoryItem[]>(
    () => details?.history || [],
    [details?.history]
  );

  const submitDeposit = useCallback(async () => {
    if (!details?.user.id) {
      Alert.alert("Live Deposit Error", "Missing user information.");
      return;
    }

    if (!transactionType) {
      Alert.alert("Validation", "Please select a transaction type.");
      return;
    }

    const parsedAmount = Number(amountInput);

    if (!amountInput.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Validation", "Please enter an amount greater than 0.");
      return;
    }

    try {
      setSending(true);
      const created = await createLiveDeposit({
        userId: details.user.id,
        bankAccountId: details.bankAccount.id,
        type: transactionType,
        amount: parsedAmount,
        createdBy: profile?.id,
      });

      setDetails((current) =>
        current
          ? {
              ...current,
              history: [created, ...current.history],
            }
          : current
      );
      setTransactionType(null);
      setAmountInput("");
      showToast("Deposit sent successfully");
    } catch (error: any) {
      showToast(error.message || "Unable to send deposit.");
    } finally {
      setSending(false);
    }
  }, [amountInput, details, profile?.id, showToast, transactionType]);

  return {
    loading,
    sending,
    details,
    history,
    transactionType,
    amountInput,
    showAccountNumber,
    toast,
    setTransactionType,
    setAmountInput,
    setShowAccountNumber,
    submitDeposit,
    refetch: loadDetails,
  };
}
