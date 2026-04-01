import { useAuth } from "@/contexts/AuthContext";
import {
  type AdminWithdrawalRecord,
  type AdminWithdrawalStatus,
  fetchAdminWithdrawals,
  updateAdminWithdrawalStatus,
} from "@/services/adminWithdrawalsService";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

const PAGE_SIZE = 20;

export type WithdrawalTab = "total" | "approved" | "pending";
export type WithdrawalDateFilter = "all" | "24h" | "7d" | "30d";

type WithdrawalSummary = {
  totalCount: number;
  approvedCount: number;
  pendingCount: number;
};

const EMPTY_SUMMARY: WithdrawalSummary = {
  totalCount: 0,
  approvedCount: 0,
  pendingCount: 0,
};

function getDateFilterCutoff(filter: WithdrawalDateFilter) {
  const now = Date.now();

  switch (filter) {
    case "24h":
      return now - 24 * 60 * 60 * 1000;
    case "7d":
      return now - 7 * 24 * 60 * 60 * 1000;
    case "30d":
      return now - 30 * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
}

function matchesTab(record: AdminWithdrawalRecord, tab: WithdrawalTab) {
  if (tab === "approved") {
    return record.status === "approved";
  }

  if (tab === "pending") {
    return record.status === "pending";
  }

  return true;
}

function matchesDateFilter(record: AdminWithdrawalRecord, filter: WithdrawalDateFilter) {
  const cutoff = getDateFilterCutoff(filter);

  if (!cutoff) {
    return true;
  }

  if (!record.createdAt) {
    return false;
  }

  const createdTime = new Date(record.createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return false;
  }

  return createdTime >= cutoff;
}

export function useAdminWithdrawals() {
  const { profile } = useAuth();
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [actionWithdrawalId, setActionWithdrawalId] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<AdminWithdrawalStatus | null>(null);
  const [activeTab, setActiveTab] = useState<WithdrawalTab>("total");
  const [dateFilter, setDateFilter] = useState<WithdrawalDateFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadWithdrawals = useCallback(async () => {
    const data = await fetchAdminWithdrawals();
    setWithdrawals(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const run = async () => {
        try {
          setLoading(true);
          const data = await fetchAdminWithdrawals();

          if (!active) {
            return;
          }

          setWithdrawals(data);
        } catch (error: any) {
          if (active) {
            Alert.alert(
              "Withdrawals Error",
              error.message || "Unable to load withdrawal requests right now."
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      void run();

      return () => {
        active = false;
      };
    }, [])
  );

  const summary = useMemo(() => {
    return withdrawals.reduce<WithdrawalSummary>(
      (accumulator, record) => {
        accumulator.totalCount += 1;

        if (record.status === "approved") {
          accumulator.approvedCount += 1;
        }

        if (record.status === "pending") {
          accumulator.pendingCount += 1;
        }

        return accumulator;
      },
      { ...EMPTY_SUMMARY }
    );
  }, [withdrawals]);

  const filteredWithdrawals = useMemo(() => {
    const normalizedSearch = searchEmail.trim().toLowerCase();

    const baseList = withdrawals
      .filter((record) => matchesTab(record, activeTab))
      .filter((record) => matchesDateFilter(record, dateFilter));

    if (!normalizedSearch) {
      return baseList;
    }

    const matching = baseList.filter(
      (record) => record.user.email?.trim().toLowerCase() === normalizedSearch
    );
    const remainder = baseList.filter(
      (record) => record.user.email?.trim().toLowerCase() !== normalizedSearch
    );

    return [...matching, ...remainder];
  }, [activeTab, dateFilter, searchEmail, withdrawals]);

  const visibleWithdrawals = useMemo(
    () => filteredWithdrawals.slice(0, visibleCount),
    [filteredWithdrawals, visibleCount]
  );

  const hasMore = filteredWithdrawals.length > visibleCount;

  const handleSearch = useCallback(async () => {
    const normalizedEmail = searchInput.trim().toLowerCase();

    try {
      setSearching(true);
      setVisibleCount(PAGE_SIZE);

      if (!normalizedEmail) {
        setSearchEmail("");
        return;
      }

      const hasMatch = withdrawals.some(
        (record) =>
          matchesTab(record, activeTab) &&
          matchesDateFilter(record, dateFilter) &&
          record.user.email?.trim().toLowerCase() === normalizedEmail
      );

      if (!hasMatch) {
        Alert.alert("Search", "User not found");
        setSearchEmail("");
        return;
      }

      setSearchEmail(normalizedEmail);
    } finally {
      setSearching(false);
    }
  }, [activeTab, dateFilter, searchInput, withdrawals]);

  const handleSetTab = useCallback((tab: WithdrawalTab) => {
    setActiveTab(tab);
    setVisibleCount(PAGE_SIZE);
    setSearchEmail("");
  }, []);

  const handleSetDateFilter = useCallback((filter: WithdrawalDateFilter) => {
    setDateFilter(filter);
    setVisibleCount(PAGE_SIZE);
    setSearchEmail("");
  }, []);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    setVisibleCount((current) => current + PAGE_SIZE);
    setLoadingMore(false);
  }, []);

  const updateStatus = useCallback(
    async (withdrawalId: string, status: AdminWithdrawalStatus) => {
      if (!profile?.id || actionWithdrawalId) {
        return;
      }

      const previousWithdrawals = withdrawals;
      const timestamp = new Date().toISOString();

      setActionWithdrawalId(withdrawalId);
      setActionStatus(status);
      setWithdrawals((current) =>
        current.map((record) =>
          record.id === withdrawalId
            ? {
                ...record,
                status,
                verifiedBy: profile.id,
                verifiedAt: timestamp,
              }
            : record
        )
      );

      try {
        const updated = await updateAdminWithdrawalStatus({
          withdrawalId,
          adminId: profile.id,
          status,
        });

        setWithdrawals((current) =>
          current.map((record) =>
            record.id === withdrawalId
              ? {
                  ...record,
                  status: updated.status as AdminWithdrawalRecord["status"],
                  verifiedBy: updated.verifiedBy,
                  verifiedAt: updated.verifiedAt,
                }
              : record
          )
        );
      } catch (error: any) {
        setWithdrawals(previousWithdrawals);
        Alert.alert(
          "Update Error",
          error.message || "Unable to update this withdrawal request."
        );
      } finally {
        setActionWithdrawalId(null);
        setActionStatus(null);
      }
    },
    [actionWithdrawalId, profile?.id, withdrawals]
  );

  return {
    loading,
    loadingMore,
    searching,
    actionWithdrawalId,
    actionStatus,
    activeTab,
    dateFilter,
    searchInput,
    visibleWithdrawals,
    hasMore,
    summary,
    setSearchInput,
    handleSearch,
    handleSetTab,
    handleSetDateFilter,
    handleLoadMore,
    approveWithdrawal: (withdrawalId: string) => updateStatus(withdrawalId, "approved"),
    markWithdrawalPending: (withdrawalId: string) => updateStatus(withdrawalId, "pending"),
    reloadWithdrawals: loadWithdrawals,
  };
}
