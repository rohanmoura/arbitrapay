import { useCallback, useMemo, useState } from "react";
import { Alert, Linking } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import {
  buildTelegramUrl,
  fetchAdminTelegramId,
} from "@/services/adminSettingsService";
import { createSupportTicket } from "@/services/supportTicketService";

const CATEGORIES = [
  { label: "Deposit Issue", value: "deposit_issue" },
  { label: "Withdrawal Issue", value: "withdrawal_issue" },
  { label: "Account Issue", value: "account_issue" },
  { label: "Technical Issue", value: "technical_issue" },
  { label: "Other", value: "other" },
] as const;

export function useHelpCenter() {
  const { session } = useAuth();
  const [ticketVisible, setTicketVisible] = useState(false);
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]["label"]>("Account Issue");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [telegramError, setTelegramError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(subject.trim() && message.trim()) && !submitting;
  }, [message, subject, submitting]);

  const openTicketModal = useCallback(() => {
    if (submitting) {
      return;
    }

    setTelegramError("");
    setTicketVisible(true);
  }, [submitting]);

  const closeTicketModal = useCallback(() => {
    if (submitting) {
      return;
    }

    setTelegramError("");
    setTicketVisible(false);
  }, [submitting]);

  const updateTelegramId = useCallback((value: string) => {
    setTelegramId(value);

    if (value.trim()) {
      setTelegramError("");
    }
  }, []);

  const openTelegram = useCallback(async () => {
    try {
      const adminTelegramId = await fetchAdminTelegramId();
      const telegramUrl = buildTelegramUrl(adminTelegramId);
      const supported = await Linking.canOpenURL(telegramUrl);

      if (!supported) {
        throw new Error("Telegram link is unavailable right now.");
      }

      await Linking.openURL(telegramUrl);
    } catch (error: any) {
      Alert.alert(
        "Telegram Error",
        error.message || "Unable to open the Telegram channel."
      );
    }
  }, []);

  const submitTicket = useCallback(async () => {
    if (!telegramId.trim()) {
      setTelegramError("Telegram ID is required.");
      return;
    }

    setTelegramError("");

    if (!session?.user?.id || !canSubmit) {
      return;
    }

    setSubmitting(true);

    try {
      await createSupportTicket({
        userId: session.user.id,
        category:
          CATEGORIES.find((item) => item.label === category)?.value || "account_issue",
        subject: subject.trim(),
        message: message.trim(),
        userTelegramId: telegramId.trim(),
      });

      setTicketVisible(false);
      setCategory("Account Issue");
      setSubject("");
      setMessage("");
      setTelegramId("");
      setTelegramError("");
      Alert.alert(
        "Ticket Submitted",
        "Your support ticket has been created successfully."
      );
    } catch (error: any) {
      Alert.alert(
        "Support Ticket Error",
        error.message || "Unable to submit your support ticket."
      );
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, category, message, session?.user?.id, subject, telegramId]);


  return {
    categories: CATEGORIES.map((item) => item.label),
    ticketVisible,
    category,
    subject,
    message,
    telegramId,
    telegramError,
    submitting,
    canSubmit,
    setCategory,
    setSubject,
    setMessage,
    setTelegramId: updateTelegramId,
    openTelegram,
    openTicketModal,
    closeTicketModal,
    submitTicket,
  };
}
