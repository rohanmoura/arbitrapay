import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

import {
  type AdminUsdtSellRecord,
  fetchAdminUsdtSellRequests,
} from "@/services/adminUsdtSellService";

const PAGE_SIZE = 20;

export type UsdtSellDateFilter = "all" | "24h" | "7d" | "30d";

type UsdtSellSummary = {
  totalCount: number;
  totalAmountUsdt: number;
};

const EMPTY_SUMMARY: UsdtSellSummary = {
  totalCount: 0,
  totalAmountUsdt: 0,
};

function getDateFilterCutoff(filter: UsdtSellDateFilter) {
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

function matchesDateFilter(record: AdminUsdtSellRecord, filter: UsdtSellDateFilter) {
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

export function useAdminUsdtSell() {
  const [requests, setRequests] = useState<AdminUsdtSellRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [dateFilter, setDateFilter] = useState<UsdtSellDateFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const run = async () => {
        try {
          setLoading(true);
          const data = await fetchAdminUsdtSellRequests();

          if (!active) {
            return;
          }

          setRequests(data);
        } catch (error: any) {
          if (active) {
            Alert.alert(
              "USDT Requests Error",
              error.message || "Unable to load USDT sell requests right now."
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
    return requests.reduce<UsdtSellSummary>(
      (accumulator, record) => {
        accumulator.totalCount += 1;
        accumulator.totalAmountUsdt += record.amountUsdt;
        return accumulator;
      },
      { ...EMPTY_SUMMARY }
    );
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchEmail.trim().toLowerCase();

    const baseList = requests.filter((record) =>
      matchesDateFilter(record, dateFilter)
    );

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
  }, [dateFilter, requests, searchEmail]);

  const visibleRequests = useMemo(
    () => filteredRequests.slice(0, visibleCount),
    [filteredRequests, visibleCount]
  );

  const hasMore = filteredRequests.length > visibleCount;

  const handleSearch = useCallback(async () => {
    const normalizedEmail = searchInput.trim().toLowerCase();

    try {
      setSearching(true);
      setVisibleCount(PAGE_SIZE);

      if (!normalizedEmail) {
        setSearchEmail("");
        return;
      }

      const hasMatch = requests.some(
        (record) =>
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
  }, [dateFilter, requests, searchInput]);

  const handleSetDateFilter = useCallback((filter: UsdtSellDateFilter) => {
    setDateFilter(filter);
    setVisibleCount(PAGE_SIZE);
    setSearchEmail("");
  }, []);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    setVisibleCount((current) => current + PAGE_SIZE);
    setLoadingMore(false);
  }, []);

  return {
    loading,
    loadingMore,
    searching,
    dateFilter,
    searchInput,
    visibleRequests,
    hasMore,
    summary,
    setSearchInput,
    handleSearch,
    handleSetDateFilter,
    handleLoadMore,
  };
}
