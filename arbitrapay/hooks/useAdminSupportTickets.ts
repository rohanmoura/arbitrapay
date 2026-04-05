import {
  deleteAdminSupportTicket,
  fetchAdminSupportTickets,
  updateAdminSupportTicketStatus,
  type AdminSupportTicket,
  type AdminSupportTicketStatus,
} from "@/services/adminSupportTicketsService";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

const PAGE_SIZE = 20;

type SupportTicketsSummary = {
  totalCount: number;
};

const EMPTY_SUMMARY: SupportTicketsSummary = {
  totalCount: 0,
};

export function useAdminSupportTickets() {
  const [tickets, setTickets] = useState<AdminSupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [actionTicketId, setActionTicketId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"resolve" | "delete" | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadTickets = useCallback(async () => {
    const data = await fetchAdminSupportTickets();
    setTickets(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const run = async () => {
        try {
          setLoading(true);
          const data = await fetchAdminSupportTickets();

          if (!active) {
            return;
          }

          setTickets(data);
        } catch (error: any) {
          if (active) {
            Alert.alert(
              "Support Tickets Error",
              error.message || "Unable to load support tickets right now."
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

  const summary = useMemo(
    () => ({
      ...EMPTY_SUMMARY,
      totalCount: tickets.length,
    }),
    [tickets]
  );

  const filteredTickets = useMemo(() => {
    const normalizedSearch = searchEmail.trim().toLowerCase();

    if (!normalizedSearch) {
      return tickets;
    }

    const matching = tickets.filter(
      (ticket) => ticket.user.email?.trim().toLowerCase() === normalizedSearch
    );
    const remainder = tickets.filter(
      (ticket) => ticket.user.email?.trim().toLowerCase() !== normalizedSearch
    );

    return [...matching, ...remainder];
  }, [searchEmail, tickets]);

  const visibleTickets = useMemo(
    () => filteredTickets.slice(0, visibleCount),
    [filteredTickets, visibleCount]
  );

  const hasMore = filteredTickets.length > visibleCount;

  const handleSearch = useCallback(async () => {
    const normalizedEmail = searchInput.trim().toLowerCase();

    try {
      setSearching(true);
      setVisibleCount(PAGE_SIZE);

      if (!normalizedEmail) {
        setSearchEmail("");
        return;
      }

      const hasMatch = tickets.some(
        (ticket) => ticket.user.email?.trim().toLowerCase() === normalizedEmail
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
  }, [searchInput, tickets]);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    setVisibleCount((current) => current + PAGE_SIZE);
    setLoadingMore(false);
  }, []);

  const resolveTicket = useCallback(
    async (ticketId: string) => {
      if (actionTicketId) {
        return;
      }

      const previousTickets = tickets;
      const timestamp = new Date().toISOString();

      setActionTicketId(ticketId);
      setActionType("resolve");
      setTickets((current) =>
        current.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: "resolved",
                updatedAt: timestamp,
              }
            : ticket
        )
      );

      try {
        const updated = await updateAdminSupportTicketStatus({
          ticketId,
          status: "resolved",
        });

        setTickets((current) =>
          current.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  status: updated.status as AdminSupportTicketStatus,
                  updatedAt: updated.updatedAt,
                }
              : ticket
          )
        );
      } catch (error: any) {
        setTickets(previousTickets);
        Alert.alert(
          "Update Error",
          error.message || "Unable to resolve this support ticket."
        );
      } finally {
        setActionTicketId(null);
        setActionType(null);
      }
    },
    [actionTicketId, tickets]
  );

  const deleteTicket = useCallback(
    async (ticketId: string) => {
      if (actionTicketId) {
        return;
      }

      const previousTickets = tickets;

      setActionTicketId(ticketId);
      setActionType("delete");
      setTickets((current) => current.filter((ticket) => ticket.id !== ticketId));

      try {
        await deleteAdminSupportTicket(ticketId);
      } catch (error: any) {
        setTickets(previousTickets);
        Alert.alert(
          "Delete Error",
          error.message || "Unable to delete this support ticket."
        );
      } finally {
        setActionTicketId(null);
        setActionType(null);
      }
    },
    [actionTicketId, tickets]
  );

  return {
    loading,
    loadingMore,
    searching,
    actionTicketId,
    actionType,
    searchInput,
    visibleTickets,
    hasMore,
    summary,
    setSearchInput,
    handleSearch,
    handleLoadMore,
    resolveTicket,
    deleteTicket,
    reloadTickets: loadTickets,
  };
}
