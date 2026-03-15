import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "@/contexts/AuthContext";
import {
  fetchPaymentHistoryData,
  markTransactionsSeen,
  type PaymentHistoryItem,
  type PaymentHistorySummary,
  type TransactionFilter,
} from "@/services/paymentHistoryService";

function sortItems(items: PaymentHistoryItem[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return [...items].sort((left, right) => {
    const leftCreated = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    const rightCreated = right.createdAt ? new Date(right.createdAt).getTime() : 0;

    if (!normalizedQuery) {
      return rightCreated - leftCreated;
    }

    const leftMatch = left.transactionId.toLowerCase().includes(normalizedQuery);
    const rightMatch = right.transactionId.toLowerCase().includes(normalizedQuery);

    if (leftMatch !== rightMatch) {
      return leftMatch ? -1 : 1;
    }

    return rightCreated - leftCreated;
  });
}

function filterItems(items: PaymentHistoryItem[], activeTab: TransactionFilter) {
  if (activeTab === "Deposits") {
    return items.filter(
      (item) =>
        item.type === "security_deposit" ||
        (item.type === "live_deposit" && item.liveDepositKind === "credit")
    );
  }

  if (activeTab === "Withdrawals") {
    return items.filter(
      (item) =>
        item.type === "withdrawal" ||
        (item.type === "live_deposit" && item.liveDepositKind === "debit")
    );
  }

  return items.filter(
    (item) =>
      item.type === "security_deposit" ||
      item.type === "withdrawal" ||
      item.type === "live_deposit"
  );
}

const EMPTY_SUMMARY: PaymentHistorySummary = {
  totalDeposits: 0,
  totalWithdrawals: 0,
  pendingTransactions: 0,
  currentBalance: 0,
  pendingWithdrawals: 0,
  totalBankAccounts: 0,
  verifiedBankAccounts: 0,
};

export function usePaymentHistory() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TransactionFilter>("All");
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState<PaymentHistorySummary>(EMPTY_SUMMARY);
  const [items, setItems] = useState<PaymentHistoryItem[]>([]);
  const [visibleTransactionId, setVisibleTransactionId] = useState<string | null>(null);

  const loadPaymentHistory = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await fetchPaymentHistoryData(session.user.id);
      setSummary(result.summary);
      setItems(result.items);
      await markTransactionsSeen(session.user.id);
    } catch (error: any) {
      Alert.alert(
        "Payment History Error",
        error.message || "Unable to load payment history."
      );
      setSummary(EMPTY_SUMMARY);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadPaymentHistory();
    }, [loadPaymentHistory])
  );

  const filteredItems = useMemo(() => {
    const tabFiltered = filterItems(items, activeTab);

    return sortItems(tabFiltered, search);
  }, [activeTab, items, search]);

  return {
    loading,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    summary,
    items: filteredItems,
    visibleTransactionId,
    setVisibleTransactionId,
  };
}
