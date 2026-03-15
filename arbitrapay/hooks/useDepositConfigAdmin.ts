import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "@/contexts/AuthContext";
import {
  fetchDepositConfiguration,
  saveDepositConfiguration,
} from "@/services/depositConfigService";

export type DepositConfigTab = "upi" | "bank";

export function useDepositConfigAdmin() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<DepositConfigTab>("upi");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");

  const loadConfiguration = useCallback(async () => {
    setLoading(true);

    try {
      const config = await fetchDepositConfiguration();
      setUpiId(config.upiId);
      setAccountNumber(config.bankTransfer.accountNumber);
      setIfscCode(config.bankTransfer.ifscCode);
      setBankName(config.bankTransfer.bankName);
    } catch (error: any) {
      Alert.alert(
        "Deposit Setup Error",
        error.message || "Unable to load deposit configuration."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadConfiguration();
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

    if (!upiId.trim()) {
      Alert.alert("Validation Error", "UPI ID is required.");
      return;
    }

    if (!accountNumber.trim() || !ifscCode.trim() || !bankName.trim()) {
      Alert.alert(
        "Validation Error",
        "Account number, IFSC code, and bank name are required."
      );
      return;
    }

    setSaving(true);

    try {
      await saveDepositConfiguration({
        upiId: upiId.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        bankName: bankName.trim(),
        updatedBy: session.user.id,
      });

      setIfscCode((current) => current.trim().toUpperCase());
      setEditing(false);
      Alert.alert("Saved", "Deposit configuration updated successfully.");
    } catch (error: any) {
      Alert.alert(
        "Save Error",
        error.message || "Unable to save deposit configuration."
      );
    } finally {
      setSaving(false);
    }
  }, [accountNumber, bankName, ifscCode, saving, session?.user?.id, upiId]);

  return {
    loading,
    saving,
    editing,
    activeTab,
    upiId,
    accountNumber,
    ifscCode,
    bankName,
    setActiveTab,
    setUpiId,
    setAccountNumber,
    setIfscCode,
    setBankName,
    startEditing,
    saveChanges,
  };
}
