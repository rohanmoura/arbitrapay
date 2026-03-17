import { supabase } from "@/lib/supabase";

export type AdminUserSort = "A-Z" | "Z-A";

export type AdminUserProfileRecord = {
  id: string;
  avatar: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  status: string | null;
};

export type AdminUsersSummary = {
  totalUsers: number;
  activeUsers: number;
  activatedUsers: number;
  suspendedUsers: number;
};

const USER_ROLE = "user";
const SUSPENDED_STATUS = "suspended";

export function isUserSuspended(status?: string | null) {
  return status?.trim().toLowerCase() === SUSPENDED_STATUS;
}

async function fetchRoleScopedCount(
  status?: string
) {
  let query = supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", USER_ROLE);

  if (status) {
    query = query.eq("status", status);
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function fetchActivatedUserCount() {
  const { data, error } = await supabase.from("bank_accounts").select("user_id");

  if (error) {
    throw error;
  }

  const uniqueUserIds = [...new Set((data || []).map((row) => row.user_id).filter(Boolean))];

  if (uniqueUserIds.length === 0) {
    return 0;
  }

  const { count, error: profileError } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", USER_ROLE)
    .in("id", uniqueUserIds);

  if (profileError) {
    throw profileError;
  }

  return count ?? 0;
}

export async function fetchAdminUsersSummary(): Promise<AdminUsersSummary> {
  const [totalUsers, suspendedUsers, activatedUsers] = await Promise.all([
    fetchRoleScopedCount(),
    fetchRoleScopedCount(SUSPENDED_STATUS),
    fetchActivatedUserCount(),
  ]);

  return {
    totalUsers,
    activeUsers: Math.max(totalUsers - suspendedUsers, 0),
    activatedUsers,
    suspendedUsers,
  };
}

export async function fetchAdminUsers(limit: number, sort: AdminUserSort) {
  const ascending = sort === "A-Z";

  const { data, error } = await supabase
    .from("profiles")
    .select("id, avatar, email, name, phone, status")
    .eq("role", USER_ROLE)
    .order("email", { ascending, nullsFirst: false })
    .range(0, Math.max(limit - 1, 0));

  if (error) {
    throw error;
  }

  return (data || []) as AdminUserProfileRecord[];
}

export async function fetchActivatedUserIds(userIds: string[]) {
  if (userIds.length === 0) {
    return new Set<string>();
  }

  const { data, error } = await supabase
    .from("bank_accounts")
    .select("user_id")
    .in("user_id", userIds);

  if (error) {
    throw error;
  }

  return new Set((data || []).map((row) => row.user_id).filter(Boolean));
}

export async function fetchAdminUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, avatar, email, name, phone, status")
    .eq("role", USER_ROLE)
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as AdminUserProfileRecord | null;
}

export async function suspendAdminUser(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      status: SUSPENDED_STATUS,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .eq("role", USER_ROLE)
    .select("id, avatar, email, name, phone, status")
    .single();

  if (error) {
    throw error;
  }

  return data as AdminUserProfileRecord;
}
