import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

import { useAuth } from "@/contexts/AuthContext";
import { pickImageFromGallery } from "@/utils/imageUpload";
import {
  createUsdtSellRequest,
  DEFAULT_USDT_SELL_CONFIGURATION,
  fetchLatestUsdtSellRequest,
  fetchUsdtSellConfiguration,
  uploadUsdtSellProof,
} from "@/services/usdtSellService";

type FormErrors = {
  amountUsdt: string;
  transactionHash: string;
  screenshot: string;
};

const EMPTY_ERRORS: FormErrors = {
  amountUsdt: "",
  transactionHash: "",
  screenshot: "",
};

function formatDate(date: string | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function validateForm(
  amountUsdt: string,
  transactionHash: string,
  screenshot: string | null
) {
  const errors: FormErrors = { ...EMPTY_ERRORS };
  const numericAmount = Number(amountUsdt);

  if (!amountUsdt || Number.isNaN(numericAmount) || numericAmount <= 0) {
    errors.amountUsdt = "Enter a valid USDT amount";
  }

  if (!transactionHash.trim()) {
    errors.transactionHash = "Transaction hash is required";
  }

  if (!screenshot) {
    errors.screenshot = "Payment screenshot is required";
  }

  return errors;
}

function hasErrors(errors: FormErrors) {
  return Object.values(errors).some(Boolean);
}

export function useUsdtSell() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pickingScreenshot, setPickingScreenshot] = useState(false);
  const [amountUsdt, setAmountUsdt] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);
  const [lastSell, setLastSell] = useState("—");
  const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRORS);
  const [configuration, setConfiguration] = useState(DEFAULT_USDT_SELL_CONFIGURATION);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast("");
      setCopied(false);
    }, 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const loadData = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [latestRequest, usdtConfiguration] = await Promise.all([
        fetchLatestUsdtSellRequest(session.user.id),
        fetchUsdtSellConfiguration(),
      ]);

      setLastSell(formatDate(latestRequest?.created_at || null));
      setConfiguration(usdtConfiguration);
    } catch (error: any) {
      Alert.alert(
        "USDT Sell Error",
        error.message || "Unable to load USDT Sell setup right now."
      );
      setLastSell("—");
      setConfiguration(DEFAULT_USDT_SELL_CONFIGURATION);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  const copyWalletAddress = useCallback(async () => {
    await Clipboard.setStringAsync(configuration.walletAddress);
    setCopied(true);
    showToast("Wallet address copied");
  }, [configuration.walletAddress, showToast]);

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
        error.message || "Unable to select transaction screenshot."
      );
    } finally {
      setPickingScreenshot(false);
    }
  }, [pickingScreenshot, submitting]);

  const submitUsdtSellRequest = useCallback(async () => {
    if (!session?.user?.id || submitting || pickingScreenshot) {
      return;
    }

    const nextErrors = validateForm(amountUsdt, transactionHash, screenshot);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    setSubmitting(true);

    try {
      const screenshotUrl = await uploadUsdtSellProof(session.user.id, screenshot!);

      const created = await createUsdtSellRequest({
        userId: session.user.id,
        amountUsdt: Number(amountUsdt),
        transactionHash: transactionHash.trim(),
        screenshotUrl,
      });

      setLastSell(formatDate(created.created_at));
      setAmountUsdt("");
      setTransactionHash("");
      setScreenshot(null);
      setErrors(EMPTY_ERRORS);
      showToast("USDT sell request submitted");
    } catch (error: any) {
      Alert.alert(
        "Submit Error",
        error.message || "Unable to submit USDT sell request."
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    amountUsdt,
    pickingScreenshot,
    screenshot,
    session?.user?.id,
    showToast,
    submitting,
    transactionHash,
  ]);

  return {
    loading,
    submitting,
    pickingScreenshot,
    amountUsdt,
    transactionHash,
    screenshot,
    toast,
    copied,
    lastSell,
    errors,
    configuration,
    setAmountUsdt,
    setTransactionHash,
    setErrors,
    copyWalletAddress,
    pickScreenshot,
    submitUsdtSellRequest,
  };
}
