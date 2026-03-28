import { useAuth } from "@/contexts/AuthContext";
import {
  type AdminSecurityDepositRecord,
  type AdminSecurityDepositStatus,
  fetchAdminSecurityDeposits,
  isNewSecurityDepositRequest,
  updateAdminSecurityDepositStatus,
} from "@/services/adminSecurityDepositsService";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

const PAGE_SIZE = 20;

export type SecurityDepositTab = "new" | "approved" | "pending";
export type SecurityDepositDateFilter = "all" | "24h" | "7d" | "30d";

type SecurityDepositSummary = {
  totalCount: number;
  totalAmount: number;
  newCount: number;
  approvedCount: number;
  pendingCount: number;
};

const EMPTY_SUMMARY: SecurityDepositSummary = {
  totalCount: 0,
  totalAmount: 0,
  newCount: 0,
  approvedCount: 0,
  pendingCount: 0,
};

function getDateFilterCutoff(filter: SecurityDepositDateFilter) {
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

function matchesTab(record: AdminSecurityDepositRecord, tab: SecurityDepositTab) {
  if (tab === "approved") {
    return record.status === "approved";
  }

  if (tab === "pending") {
    return record.status === "pending" && !isNewSecurityDepositRequest(record);
  }

  return isNewSecurityDepositRequest(record);
}

function matchesDateFilter(
  record: AdminSecurityDepositRecord,
  filter: SecurityDepositDateFilter
) {
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

export function useAdminSecurityDeposits() {
  const { profile } = useAuth();
  const [deposits, setDeposits] = useState<AdminSecurityDepositRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [actionDepositId, setActionDepositId] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<AdminSecurityDepositStatus | null>(null);
  const [activeTab, setActiveTab] = useState<SecurityDepositTab>("new");
  const [dateFilter, setDateFilter] = useState<SecurityDepositDateFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadDeposits = useCallback(async () => {
    const data = await fetchAdminSecurityDeposits();
    setDeposits(data);
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminSecurityDeposits();

        if (!active) {
          return;
        }

        setDeposits(data);
      } catch (error: any) {
        if (active) {
          Alert.alert(
            "Security Deposits Error",
            error.message || "Unable to load security deposit requests right now."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    return deposits.reduce<SecurityDepositSummary>(
      (accumulator, record) => {
        accumulator.totalCount += 1;
        accumulator.totalAmount += record.amount;

        if (matchesTab(record, "new")) {
          accumulator.newCount += 1;
        } else if (matchesTab(record, "approved")) {
          accumulator.approvedCount += 1;
        } else if (matchesTab(record, "pending")) {
          accumulator.pendingCount += 1;
        }

        return accumulator;
      },
      { ...EMPTY_SUMMARY }
    );
  }, [deposits]);

  const filteredDeposits = useMemo(() => {
    const normalizedSearch = searchEmail.trim().toLowerCase();

    const baseList = deposits
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
  }, [activeTab, dateFilter, deposits, searchEmail]);

  const visibleDeposits = useMemo(
    () => filteredDeposits.slice(0, visibleCount),
    [filteredDeposits, visibleCount]
  );

  const hasMore = filteredDeposits.length > visibleCount;

  const handleSearch = useCallback(async () => {
    const normalizedEmail = searchInput.trim().toLowerCase();

    try {
      setSearching(true);
      setVisibleCount(PAGE_SIZE);

      if (!normalizedEmail) {
        setSearchEmail("");
        return;
      }

      const hasMatch = deposits.some(
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
  }, [activeTab, dateFilter, deposits, searchInput]);

  const handleSetTab = useCallback((tab: SecurityDepositTab) => {
    setActiveTab(tab);
    setVisibleCount(PAGE_SIZE);
    setSearchEmail("");
  }, []);

  const handleSetDateFilter = useCallback((filter: SecurityDepositDateFilter) => {
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
    async (depositId: string, status: AdminSecurityDepositStatus) => {
      if (!profile?.id || actionDepositId) {
        return;
      }

      const previousDeposits = deposits;
      const timestamp = new Date().toISOString();

      setActionDepositId(depositId);
      setActionStatus(status);
      setDeposits((current) =>
        current.map((record) =>
          record.id === depositId
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
        const updated = await updateAdminSecurityDepositStatus({
          depositId,
          adminId: profile.id,
          status,
        });

        setDeposits((current) =>
          current.map((record) =>
            record.id === depositId
              ? {
                  ...record,
                  status: updated.status as AdminSecurityDepositRecord["status"],
                  verifiedBy: updated.verifiedBy,
                  verifiedAt: updated.verifiedAt,
                }
              : record
          )
        );
      } catch (error: any) {
        setDeposits(previousDeposits);
        Alert.alert(
          "Update Error",
          error.message || "Unable to update this security deposit request."
        );
      } finally {
        setActionDepositId(null);
        setActionStatus(null);
      }
    },
    [actionDepositId, deposits, profile?.id]
  );

  return {
    loading,
    loadingMore,
    searching,
    actionDepositId,
    actionStatus,
    activeTab,
    dateFilter,
    searchInput,
    searchEmail,
    visibleDeposits,
    hasMore,
    summary,
    setSearchInput,
    handleSearch,
    handleSetTab,
    handleSetDateFilter,
    handleLoadMore,
    approveDeposit: (depositId: string) => updateStatus(depositId, "approved"),
    markDepositPending: (depositId: string) => updateStatus(depositId, "pending"),
    reloadDeposits: loadDeposits,
  };
}
