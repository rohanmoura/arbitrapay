import { supabase } from "@/lib/supabase";

type UsdtProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: "user" | "admin" | null;
};

type RawAdminUsdtSellRow = {
  id: string;
  user_id: string | null;
  amount_usdt: number | string | null;
  transaction_hash: string | null;
  screenshot_url: string | null;
  created_at: string | null;
  status: string | null;
  profiles: UsdtProfileRow | UsdtProfileRow[] | null;
};

export type AdminUsdtSellRecord = {
  id: string;
  userId: string;
  amountUsdt: number;
  transactionHash: string;
  screenshotUrl: string;
  createdAt: string | null;
  status: "approved" | "pending" | "rejected";
  user: {
    id: string;
    email: string | null;
    name: string | null;
    avatar: string | null;
  };
};

function getSingleRow<T>(value: T | T[] | null) {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] || null : value;
}

export async function fetchAdminUsdtSellRequests() {
  const { data, error } = await supabase
    .from("usdt_sell_requests")
    .select(
      `
      id,
      user_id,
      amount_usdt,
      transaction_hash,
      screenshot_url,
      created_at,
      status,
      profiles!usdt_sell_requests_user_id_fkey (
        id,
        email,
        name,
        avatar,
        role
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const mappedRows = ((data || []) as RawAdminUsdtSellRow[])
    .map((row) => {
      const profile = getSingleRow(row.profiles);

      if (!row.user_id || !profile || profile.role !== "user") {
        return null;
      }

      return {
        id: row.id,
        userId: row.user_id,
        amountUsdt: Number(row.amount_usdt || 0),
        transactionHash: row.transaction_hash || "",
        screenshotUrl: row.screenshot_url || "",
        createdAt: row.created_at,
        status:
          row.status === "approved"
            ? "approved"
            : row.status === "rejected"
              ? "rejected"
              : "pending",
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar,
        },
      } satisfies AdminUsdtSellRecord;
    })
    .filter(Boolean) as AdminUsdtSellRecord[];

  const dedupedRows = new Map<string, AdminUsdtSellRecord>();

  mappedRows.forEach((row) => {
    if (!dedupedRows.has(row.id)) {
      dedupedRows.set(row.id, row);
    }
  });

  return [...dedupedRows.values()];
}
