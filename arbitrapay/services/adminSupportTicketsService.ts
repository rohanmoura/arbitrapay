import { supabase } from "@/lib/supabase";

type SupportTicketProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: "user" | "admin" | null;
};

type RawSupportTicketRow = {
  id: string;
  user_id: string | null;
  category: string | null;
  subject: string | null;
  message: string | null;
  status: "pending" | "resolved" | "closed" | null;
  created_at: string | null;
  updated_at: string | null;
  user_telegram_id: string | null;
  profiles: SupportTicketProfileRow | SupportTicketProfileRow[] | null;
};

export type AdminSupportTicketStatus = "pending" | "resolved" | "closed";

export type AdminSupportTicket = {
  id: string;
  userId: string;
  category: string;
  subject: string;
  message: string;
  status: AdminSupportTicketStatus;
  createdAt: string | null;
  updatedAt: string | null;
  userTelegramId: string | null;
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

export async function fetchAdminSupportTickets() {
  const { data, error } = await supabase
    .from("support_tickets")
    .select(
      `
      id,
      user_id,
      category,
      subject,
      message,
      status,
      created_at,
      updated_at,
      user_telegram_id,
      profiles!support_tickets_user_id_fkey (
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

  const mappedRows = ((data || []) as RawSupportTicketRow[])
    .map((row) => {
      const profile = getSingleRow(row.profiles);

      if (!row.user_id || !profile || profile.role !== "user") {
        return null;
      }

      return {
        id: row.id,
        userId: row.user_id,
        category: row.category || "other",
        subject: row.subject || "",
        message: row.message || "",
        status:
          row.status === "resolved"
            ? "resolved"
            : row.status === "closed"
              ? "closed"
              : "pending",
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        userTelegramId: row.user_telegram_id,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar,
        },
      } satisfies AdminSupportTicket;
    })
    .filter(Boolean) as AdminSupportTicket[];

  const dedupedRows = new Map<string, AdminSupportTicket>();

  mappedRows.forEach((row) => {
    if (!dedupedRows.has(row.id)) {
      dedupedRows.set(row.id, row);
    }
  });

  return [...dedupedRows.values()];
}

export async function updateAdminSupportTicketStatus(input: {
  ticketId: string;
  status: Extract<AdminSupportTicketStatus, "resolved">;
}) {
  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from("support_tickets")
    .update({
      status: input.status,
      updated_at: timestamp,
    })
    .eq("id", input.ticketId)
    .select("id, status, updated_at")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    status: data.status === "resolved" ? "resolved" : "pending",
    updatedAt: data.updated_at,
  };
}

export async function deleteAdminSupportTicket(ticketId: string) {
  const { error } = await supabase
    .from("support_tickets")
    .delete()
    .eq("id", ticketId);

  if (error) {
    throw error;
  }
}
