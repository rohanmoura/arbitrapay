import FullScreenLoader from "@/components/FullScreenLoader";
import { styles } from "@/screens/admin-dashboard/UserDetail.styles";
import {
  fetchAdminUserDetail,
  isUserSuspended,
  suspendAdminUser,
} from "@/services/adminUsersService";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UserDetailState = Awaited<ReturnType<typeof fetchAdminUserDetail>>;

function formatJoinedDate(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  const datePart = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart} (${timePart})`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [detail, setDetail] = useState<UserDetailState>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [suspending, setSuspending] = useState(false);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadUserDetail = useCallback(async () => {
    if (!id) {
      Alert.alert("User Error", "No user was selected.");
      router.back();
      return;
    }

    const result = await fetchAdminUserDetail(id);

    if (!result) {
      Alert.alert("User Error", "Unable to find this user.");
      router.back();
      return;
    }

    setDetail(result);
  }, [id]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        setLoading(true);
        await loadUserDetail();
      } catch (error: any) {
        if (active) {
          Alert.alert(
            "User Error",
            error.message || "Unable to load this user right now."
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

      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, [loadUserDetail]);

  const handleCopy = async () => {
    const email = detail?.profile.email;

    if (!email) {
      return;
    }

    await Clipboard.setStringAsync(email);
    setCopied(true);

    if (Platform.OS === "android") {
      ToastAndroid.show("Email copied", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied", "Email copied");
    }

    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current);
    }

    copiedTimeoutRef.current = setTimeout(() => setCopied(false), 1500);
  };

  const handleSuspend = () => {
    if (!detail || isUserSuspended(detail.profile.status)) {
      return;
    }

    Alert.alert(
      "Suspend User",
      "This user will be removed from system access, force logged out, and will not be able to log in again. Do you want to continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Suspend",
          style: "destructive",
          onPress: async () => {
            try {
              setSuspending(true);
              await suspendAdminUser(detail.profile.id);
              await loadUserDetail();
              Alert.alert("Success", "User has been suspended.");
            } catch (error: any) {
              Alert.alert(
                "Suspend Error",
                error.message || "Unable to suspend this user."
              );
            } finally {
              setSuspending(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!detail) {
    return null;
  }

  const { profile, bankAccountCount, approvedSecurityDepositTotal, approvedActivationCount } =
    detail;
  const suspended = isUserSuspended(profile.status);
  const displayName =
    !profile.name?.trim() || profile.name.trim() === "User"
      ? "User"
      : profile.name.trim();
  const avatarFallback = displayName.charAt(0).toUpperCase() || "U";
  const hasBankAccount = bankAccountCount > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#E2E8F0" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>User Profile</Text>

          <View style={{ width: 22 }} />
        </View>

        <View style={styles.profileCard}>
          <View style={[styles.topBadge, suspended && styles.topBadgeSuspended]}>
            <Text style={[styles.topBadgeText, suspended && styles.topBadgeTextSuspended]}>
              {suspended ? "Suspended" : "Active"}
            </Text>
          </View>

          <View style={styles.avatar}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{avatarFallback || "U"}</Text>
            )}
          </View>

          <Text style={styles.name}>{displayName}</Text>

          <View style={styles.emailRow}>
            <Text style={styles.email}>{profile.email || "Not available"}</Text>

            <TouchableOpacity onPress={handleCopy} disabled={!profile.email}>
              <Ionicons
                name={copied ? "checkmark" : "copy-outline"}
                size={16}
                color={copied ? "#22C55E" : "#94A3B8"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.statusActionRow}>
            <Text style={[styles.subStatus, !hasBankAccount && styles.subStatusWarning]}>
              {hasBankAccount ? "Bank Added" : "No Bank Account"}
            </Text>

            <TouchableOpacity
              style={[styles.suspendBtnNew, suspended && styles.suspendBtnDisabled]}
              activeOpacity={0.8}
              disabled={suspended || suspending}
              onPress={handleSuspend}
            >
              {suspending ? (
                <ActivityIndicator size="small" color="#FCA5A5" />
              ) : (
                <Text style={styles.suspendTextNew}>
                  {suspended ? "Suspended" : "Suspend"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>User Info</Text>

          <Text style={styles.infoText}>Joined: {formatJoinedDate(profile.created_at)}</Text>
          <Text style={styles.infoText}>
            Phone: {profile.phone?.trim() || "Not available"}
          </Text>
          <Text style={styles.infoText}>
            Referral: {profile.referral_code?.trim() || "Not given"}
          </Text>
        </View>

        <View style={styles.gridCard}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="card-outline" size={18} color="#818CF8" />
              <Text style={styles.rowText}>Bank Accounts</Text>
            </View>

            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>{bankAccountCount}</Text>
              <Ionicons name="chevron-forward" size={16} color="#64748B" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="wallet-outline" size={18} color="#818CF8" />
              <Text style={styles.rowText}>Security Deposits</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>
                {formatCurrency(approvedSecurityDepositTotal)}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#818CF8"
              />
              <Text style={styles.rowText}>Account Activated</Text>
            </View>

            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>{approvedActivationCount}</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="flash-outline" size={18} color="#818CF8" />
              <Text style={styles.rowText}>Live Deposits</Text>
            </View>

            <View style={styles.rowRight}>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="arrow-down-circle-outline"
                size={18}
                color="#818CF8"
              />
              <Text style={styles.rowText}>Withdrawal Requests</Text>
            </View>

            <View style={styles.rowRight}>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="receipt-outline" size={18} color="#818CF8" />
              <Text style={styles.rowText}>View Transactions</Text>
            </View>

            <View style={styles.rowRight}>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}