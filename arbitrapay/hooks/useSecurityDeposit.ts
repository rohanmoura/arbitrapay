import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

import { useAuth } from "@/contexts/AuthContext";
import { pickImageFromGallery } from "@/utils/imageUpload";
import {
  SECURITY_DEPOSIT_CONFIG,
  createSecurityDepositRequest,
  DepositMethod,
  fetchLatestSecurityDeposit,
  fetchSecurityDepositConfiguration,
  fetchUserDepositBankAccount,
  uploadSecurityDepositProof,
} from "@/services/securityDepositService";

type FormErrors = {
  amount: string;
  utr: string;
  screenshot: string;
};

const EMPTY_ERRORS: FormErrors = {
  amount: "",
  utr: "",
  screenshot: "",
};

function formatDepositDate(date: string | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function validateForm(amount: string, utr: string, screenshot: string | null) {
  const errors: FormErrors = { ...EMPTY_ERRORS };
  const numericAmount = Number(amount);

  if (!amount || Number.isNaN(numericAmount) || numericAmount < 5000) {
    errors.amount = "Minimum deposit amount is ₹5,000";
  }

  if (!utr.trim()) {
    errors.utr = "Transaction ID / UTR number is required";
  }

  if (!screenshot) {
    errors.screenshot = "Payment screenshot is required";
  }

  return errors;
}

function hasErrors(errors: FormErrors) {
  return Object.values(errors).some(Boolean);
}

export function useSecurityDeposit() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pickingScreenshot, setPickingScreenshot] = useState(false);
  const [amount, setAmount] = useState("");
  const [utr, setUtr] = useState("");
  const [method, setMethod] = useState<"upi" | "bank">("upi");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);
  const [lastDeposit, setLastDeposit] = useState("—");
  const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRORS);
  const [config, setConfig] = useState(SECURITY_DEPOSIT_CONFIG);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast("");
      setCopied(false);
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const loadLastDeposit = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [latest, depositConfig] = await Promise.all([
        fetchLatestSecurityDeposit(session.user.id),
        fetchSecurityDepositConfiguration(),
      ]);
      setLastDeposit(formatDepositDate(latest?.created_at || null));
      setConfig(depositConfig);
    } catch (error: any) {
      Alert.alert(
        "Security Deposit Error",
        error.message || "Unable to load your latest deposit."
      );
      setLastDeposit("—");
      setConfig(SECURITY_DEPOSIT_CONFIG);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadLastDeposit();
    }, [loadLastDeposit])
  );

  const copyUpi = useCallback(async () => {
    await Clipboard.setStringAsync(SECURITY_DEPOSIT_CONFIG.upiId);
    setCopied(true);
    showToast("UPI ID copied");
  }, [showToast]);

  const pickScreenshot = useCallback(async () => {
    if (pickingScreenshot || submitting) {
      return;
    }

    setPickingScreenshot(true);

    try {
      const imageUri = await pickImageFromGallery();

      if (!imageUri) {
        return;
      }

      setScreenshot(imageUri);
      setErrors((current) => ({ ...current, screenshot: "" }));
    } catch (error: any) {
      Alert.alert(
        "Screenshot Error",
        error.message || "Unable to select payment screenshot."
      );
    } finally {
      setPickingScreenshot(false);
    }
  }, [pickingScreenshot, submitting]);

  const submitDeposit = useCallback(async () => {
    if (!session?.user?.id || submitting || pickingScreenshot) {
      return;
    }

    const nextErrors = validateForm(amount, utr, screenshot);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    setSubmitting(true);

    try {
      const bankAccount = await fetchUserDepositBankAccount(session.user.id);

      if (!bankAccount) {
        Alert.alert(
          "Bank Account Required",
          "You must add a bank account before making a deposit request."
        );
        return;
      }

      const paymentProofUrl = await uploadSecurityDepositProof(
        session.user.id,
        screenshot!
      );

      const depositMethod: DepositMethod =
        method === "upi" ? "UPI" : "BANK_TRANSFER";

      const created = await createSecurityDepositRequest({
        userId: session.user.id,
        amount: Number(amount),
        utrNumber: utr.trim(),
        paymentProofUrl,
        depositMethod,
        bankAccountId: bankAccount.id,
      });

      setLastDeposit(formatDepositDate(created.created_at));
      setAmount("");
      setUtr("");
      setScreenshot(null);
      setErrors(EMPTY_ERRORS);
      showToast("Deposit request submitted");
    } catch (error: any) {
      Alert.alert(
        "Deposit Request Error",
        error.message || "Unable to submit the deposit request."
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    amount,
    method,
    pickingScreenshot,
    screenshot,
    session?.user?.id,
    showToast,
    submitting,
    utr,
  ]);

  return {
    loading,
    submitting,
    pickingScreenshot,
    amount,
    utr,
    method,
    screenshot,
    toast,
    copied,
    lastDeposit,
    errors,
    config,
    setAmount,
    setUtr,
    setMethod,
    setErrors,
    copyUpi,
    pickScreenshot,
    submitDeposit,
  };
}
