import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "@/contexts/AuthContext";
import { getUnreadTransactionState } from "@/services/paymentHistoryService";

export function useTransactionNotifications() {
  const { session } = useAuth();
  const [hasUnreadTransactions, setHasUnreadTransactions] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadUnreadState = async () => {
        if (!session?.user?.id) {
          if (active) {
            setHasUnreadTransactions(false);
          }
          return;
        }

        try {
          const hasUnread = await getUnreadTransactionState(session.user.id);

          if (active) {
            setHasUnreadTransactions(hasUnread);
          }
        } catch {
          if (active) {
            setHasUnreadTransactions(false);
          }
        }
      };

      void loadUnreadState();

      return () => {
        active = false;
      };
    }, [session?.user?.id])
  );

  return {
    hasUnreadTransactions,
  };
}
