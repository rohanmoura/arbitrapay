import type { ActivationRequestCardItem } from "@/components/admin-dashboard/ActivationRequestCard";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchAdminAccountActivationDetails,
  fetchAdminAccountActivationDetailsByUserId,
  updateAdminAccountActivationRequestStatus,
  type AdminAccountActivationDetail,
} from "@/services/adminAccountActivationDetailsService";
import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";

function updateRequestStatusLocally(
  requests: ActivationRequestCardItem[],
  requestId: string,
  status: "approved" | "pending"
) {
  return requests.map((request) =>
    request.id === requestId
      ? {
          ...request,
          status,
        }
      : request
  );
}

export function useAdminAccountActivationDetails(
  requestId?: string,
  userId?: string,
  bankAccountId?: string
) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminAccountActivationDetail | null>(null);
  const [userRequests, setUserRequests] = useState<ActivationRequestCardItem[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [latestDepositId, setLatestDepositId] = useState<string | null>(null);
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState("");
  const [copiedFieldKey, setCopiedFieldKey] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<"approved" | "pending" | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast("");
      setCopiedFieldKey(null);
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const loadRequest = useCallback(async () => {
    if (!requestId && !userId) {
      setSelectedRequest(null);
      setUserRequests([]);
      setTotalRequests(0);
      setTotalDeposits(0);
      setLatestDepositId(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = requestId
        ? await fetchAdminAccountActivationDetails(requestId)
        : await fetchAdminAccountActivationDetailsByUserId(userId!, bankAccountId);

      if (!response) {
        setSelectedRequest(null);
        setUserRequests([]);
        setTotalRequests(0);
        setTotalDeposits(0);
        setLatestDepositId(null);
        return;
      }

      setSelectedRequest(response.selectedRequest);
      setUserRequests(response.userRequests);
      setTotalRequests(response.totalRequests);
      setTotalDeposits(response.depositSummary.totalDeposits);
      setLatestDepositId(response.depositSummary.latestDepositId);
      setVisibilityMap({});
    } catch (error: any) {
      Alert.alert(
        "Account Activation Error",
        error.message || "Unable to load this activation request right now."
      );
      setSelectedRequest(null);
      setUserRequests([]);
      setTotalRequests(0);
      setTotalDeposits(0);
      setLatestDepositId(null);
    } finally {
      setLoading(false);
    }
  }, [bankAccountId, requestId, userId]);

  useEffect(() => {
    void loadRequest();
  }, [loadRequest]);

  const otherRequests = useMemo(
    () =>
      userRequests.filter((request) => request.id !== selectedRequest?.id),
    [selectedRequest?.id, userRequests]
  );

  const toggleVisibility = useCallback((fieldKey: string) => {
    setVisibilityMap((current) => ({
      ...current,
      [fieldKey]: !current[fieldKey],
    }));
  }, []);

  const copyField = useCallback(
    async (fieldKey: string, value?: string | null) => {
      if (!value) {
        return;
      }

      await Clipboard.setStringAsync(value);
      setCopiedFieldKey(fieldKey);
      showToast("Copied successfully");
    },
    [showToast]
  );

  const updateStatus = useCallback(async (status: "approved" | "pending") => {
    if (!profile?.id || !selectedRequest || selectedRequest.status === status || updatingStatus) {
      return;
    }

    const previousRequest = selectedRequest;
    const previousRequests = userRequests;
    const timestamp = new Date().toISOString();

    setUpdatingStatus(true);
    setActionStatus(status);
    setSelectedRequest({
      ...selectedRequest,
      status,
      verifiedBy: profile.id,
      verifiedAt: timestamp,
    });
    setUserRequests((current) => updateRequestStatusLocally(current, selectedRequest.id, status));

    try {
      const updated = await updateAdminAccountActivationRequestStatus({
        requestId: selectedRequest.id,
        adminId: profile.id,
        status,
      });

      setSelectedRequest((current) =>
        current
          ? {
              ...current,
              status: updated.status as "approved" | "pending" | "rejected",
              verifiedBy: updated.verifiedBy,
              verifiedAt: updated.verifiedAt,
            }
          : current
      );
      setUserRequests((current) =>
        updateRequestStatusLocally(current, selectedRequest.id, updated.status as "approved" | "pending")
      );
    } catch (error: any) {
      setSelectedRequest(previousRequest);
      setUserRequests(previousRequests);
      Alert.alert(
        "Status Update Error",
        error.message || "Unable to update this activation request."
      );
    } finally {
      setUpdatingStatus(false);
      setActionStatus(null);
    }
  }, [profile?.id, selectedRequest, updatingStatus, userRequests]);

  return {
    loading,
    selectedRequest,
    otherRequests,
    totalRequests,
    totalDeposits,
    latestDepositId,
    visibilityMap,
    toast,
    copiedFieldKey,
    actionStatus,
    updatingStatus,
    toggleVisibility,
    copyField,
    approveRequest: () => updateStatus("approved"),
    setRequestPending: () => updateStatus("pending"),
    refetch: loadRequest,
  };
}
