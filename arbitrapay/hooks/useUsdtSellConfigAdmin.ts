import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "@/contexts/AuthContext";
import {
  fetchUsdtSellConfiguration,
  saveUsdtSellConfiguration,
} from "@/services/usdtSellService";

function normalizeNumberInput(value: string) {
  const sanitized = value.replace(/[^0-9.]/g, "");
  const split = sanitized.split(".");

  if (split.length <= 2) {
    return sanitized;
  }

  return `${split[0]}.${split.slice(1).join("")}`;
}

export function useUsdtSellConfigAdmin() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [gamingRate, setGamingRate] = useState("");
  const [mixedRate, setMixedRate] = useState("");
  const [stockRate, setStockRate] = useState("");

  const loadConfiguration = useCallback(async () => {
    setLoading(true);

    try {
      const config = await fetchUsdtSellConfiguration();

      setWalletAddress(config.walletAddress);
      setNetwork(config.network);
      setGamingRate(String(config.rates.gaming));
      setMixedRate(String(config.rates.mixed));
      setStockRate(String(config.rates.stock));
    } catch (error: any) {
      Alert.alert(
        "USDT Sell Setup Error",
        error.message || "Unable to load USDT Sell configuration."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadConfiguration();
    }, [loadConfiguration])
  );

  const startEditing = useCallback(() => {
    if (loading || saving) {
      return;
    }

    setEditing(true);
  }, [loading, saving]);

  const saveChanges = useCallback(async () => {
    if (!session?.user?.id || saving) {
      return;
    }

    const parsedGaming = Number(gamingRate);
    const parsedMixed = Number(mixedRate);
    const parsedStock = Number(stockRate);

    if (!walletAddress.trim()) {
      Alert.alert("Validation Error", "Wallet address is required.");
      return;
    }

    if (!network.trim()) {
      Alert.alert("Validation Error", "Wallet network is required.");
      return;
    }

    if (
      !Number.isFinite(parsedGaming) ||
      !Number.isFinite(parsedMixed) ||
      !Number.isFinite(parsedStock) ||
      parsedGaming <= 0 ||
      parsedMixed <= 0 ||
      parsedStock <= 0
    ) {
      Alert.alert("Validation Error", "All USDT rates must be valid positive numbers.");
      return;
    }

    setSaving(true);

    try {
      await saveUsdtSellConfiguration({
        walletAddress: walletAddress.trim(),
        network: network.trim(),
        gamingRate: parsedGaming,
        mixedRate: parsedMixed,
        stockRate: parsedStock,
        updatedBy: session.user.id,
      });

      setGamingRate(String(parsedGaming));
      setMixedRate(String(parsedMixed));
      setStockRate(String(parsedStock));
      setEditing(false);
      Alert.alert("Saved", "USDT Sell setup updated successfully.");
    } catch (error: any) {
      Alert.alert(
        "Save Error",
        error.message || "Unable to save USDT Sell setup."
      );
    } finally {
      setSaving(false);
    }
  }, [gamingRate, mixedRate, network, saving, session?.user?.id, stockRate, walletAddress]);

  return {
    loading,
    saving,
    editing,
    walletAddress,
    network,
    gamingRate,
    mixedRate,
    stockRate,
    setWalletAddress,
    setNetwork,
    setGamingRate: (value: string) => setGamingRate(normalizeNumberInput(value)),
    setMixedRate: (value: string) => setMixedRate(normalizeNumberInput(value)),
    setStockRate: (value: string) => setStockRate(normalizeNumberInput(value)),
    startEditing,
    saveChanges,
  };
}
