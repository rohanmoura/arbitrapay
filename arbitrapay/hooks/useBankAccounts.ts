import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import {
  BankAccountRecord,
  createBankAccount,
  deleteBankAccount,
  fetchBankAccounts,
  setPrimaryBankAccount,
  sortBankAccounts,
} from "@/services/bankAccountService";

type FormErrors = {
  holder: string;
  accountNumber: string;
  ifsc: string;
  bank: string;
};

const EMPTY_ERRORS: FormErrors = {
  holder: "",
  accountNumber: "",
  ifsc: "",
  bank: "",
};

function mapAddErrors(
  holder: string,
  accountNumber: string,
  ifsc: string,
  bank: string
) {
  const nextErrors: FormErrors = { ...EMPTY_ERRORS };

  if (!holder.trim()) {
    nextErrors.holder = "Account holder name is required";
  }

  if (accountNumber.length < 9 || accountNumber.length > 18) {
    nextErrors.accountNumber = "Account number must be 9–18 digits";
  }

  if (ifsc.length !== 11) {
    nextErrors.ifsc = "Invalid IFSC code";
  }

  if (!bank.trim()) {
    nextErrors.bank = "Bank name required";
  }

  return nextErrors;
}

function hasFormErrors(errors: FormErrors) {
  return Object.values(errors).some(Boolean);
}

export function useBankAccounts() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [toast, setToast] = useState("");
  const [accounts, setAccounts] = useState<BankAccountRecord[]>([]);
  const [showAccount, setShowAccount] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState<string | null>(null);

  const [holder, setHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bank, setBank] = useState("");
  const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRORS);

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

  const resetForm = useCallback(() => {
    setHolder("");
    setAccountNumber("");
    setIfsc("");
    setBank("");
    setErrors(EMPTY_ERRORS);
  }, []);

  const loadAccounts = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await fetchBankAccounts(session.user.id);
      setAccounts(data);
    } catch (error: any) {
      Alert.alert(
        "Bank Account Error",
        error.message || "Unable to load bank accounts."
      );
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
    }, [loadAccounts])
  );

  const openModal = useCallback(() => {
    resetForm();
    setModalVisible(true);
  }, [resetForm]);

  const closeModal = useCallback(() => {
    if (submitting) {
      return;
    }

    setModalVisible(false);
  }, [submitting]);

  const submitAccount = useCallback(async () => {
    if (!session?.user?.id || submitting) {
      return;
    }

    const nextErrors = mapAddErrors(holder, accountNumber, ifsc, bank);
    setErrors(nextErrors);

    if (hasFormErrors(nextErrors)) {
      return;
    }

    setSubmitting(true);

    try {
      const created = await createBankAccount(
        session.user.id,
        {
          accountHolderName: holder.trim(),
          accountNumber,
          ifscCode: ifsc.trim(),
          bankName: bank.trim(),
        },
        accounts.length === 0
      );

      setAccounts((current) => sortBankAccounts([...current, created]));
      setModalVisible(false);
      resetForm();
      showToast("Bank account added");
    } catch (error: any) {
      Alert.alert(
        "Add Account Error",
        error.message || "Unable to add bank account."
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    accountNumber,
    accounts.length,
    bank,
    holder,
    ifsc,
    resetForm,
    session?.user?.id,
    showToast,
    submitting,
  ]);

  const makePrimary = useCallback(
    async (accountId: string) => {
      if (!session?.user?.id || settingPrimaryId || deletingId) {
        return;
      }

      const selected = accounts.find((account) => account.id === accountId);

      if (!selected || selected.is_default) {
        return;
      }

      setSettingPrimaryId(accountId);

      try {
        await setPrimaryBankAccount(session.user.id, accountId);
        setAccounts((current) =>
          sortBankAccounts(
            current.map((account) => ({
              ...account,
              is_default: account.id === accountId,
            }))
          )
        );
      } catch (error: any) {
        Alert.alert(
          "Primary Account Error",
          error.message || "Unable to update the primary bank account."
        );
      } finally {
        setSettingPrimaryId(null);
      }
    },
    [accounts, deletingId, session?.user?.id, settingPrimaryId]
  );

  const deleteAccount = useCallback(
    async (accountId: string) => {
      if (!session?.user?.id || deletingId || settingPrimaryId) {
        return;
      }

      const accountToDelete = accounts.find((account) => account.id === accountId);

      if (!accountToDelete) {
        return;
      }

      setDeletingId(accountId);

      try {
        await deleteBankAccount(session.user.id, accountId);

        const remainingAccounts = accounts.filter((account) => account.id !== accountId);

        if (accountToDelete.is_default && remainingAccounts.length > 0) {
          const nextPrimaryId = sortBankAccounts(remainingAccounts)[0].id;
          await setPrimaryBankAccount(session.user.id, nextPrimaryId);

          setAccounts(
            sortBankAccounts(
              remainingAccounts.map((account) => ({
                ...account,
                is_default: account.id === nextPrimaryId,
              }))
            )
          );
        } else {
          setAccounts(sortBankAccounts(remainingAccounts));
        }

        setShowAccount((current) => (current === accountId ? null : current));
        showToast("Bank account deleted");
      } catch (error: any) {
        Alert.alert(
          "Delete Account Error",
          error.message || "Unable to delete bank account."
        );
      } finally {
        setDeletingId(null);
      }
    },
    [accounts, deletingId, session?.user?.id, settingPrimaryId, showToast]
  );

  const confirmDelete = useCallback(
    (accountId: string) => {
      if (deletingId || submitting || settingPrimaryId) {
        return;
      }

      Alert.alert(
        "Delete Bank Account",
        "Are you sure you want to remove this bank account?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              void deleteAccount(accountId);
            },
          },
        ]
      );
    },
    [deleteAccount, deletingId, settingPrimaryId, submitting]
  );

  return {
    loading,
    submitting,
    modalVisible,
    toast,
    accounts,
    holder,
    accountNumber,
    ifsc,
    bank,
    errors,
    showAccount,
    deletingId,
    settingPrimaryId,
    setHolder,
    setAccountNumber,
    setIfsc,
    setBank,
    setErrors,
    setShowAccount,
    openModal,
    closeModal,
    submitAccount,
    confirmDelete,
    makePrimary,
  };
}
