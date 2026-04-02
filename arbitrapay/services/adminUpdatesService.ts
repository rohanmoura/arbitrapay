import { supabase } from "@/lib/supabase";

export type AdminUpdateRecord = {
  id: string;
  title: string;
  message: string;
  is_active: boolean;
  created_at: string | null;
  created_by: string | null;
};

const UPDATES_TABLE = "updates";

function mapUpdate(row: Partial<AdminUpdateRecord>) {
  return {
    id: String(row.id || ""),
    title: row.title || "",
    message: row.message || "",
    is_active: Boolean(row.is_active),
    created_at: row.created_at || null,
    created_by: row.created_by || null,
  } satisfies AdminUpdateRecord;
}

export async function fetchAdminUpdates() {
  const { data, error } = await supabase
    .from(UPDATES_TABLE)
    .select("id, title, message, is_active, created_at, created_by")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data || []) as Partial<AdminUpdateRecord>[]).map(mapUpdate);
}

export async function fetchAdminUpdateById(updateId: string) {
  const { data, error } = await supabase
    .from(UPDATES_TABLE)
    .select("id, title, message, is_active, created_at, created_by")
    .eq("id", updateId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapUpdate(data as Partial<AdminUpdateRecord>) : null;
}

export async function createAdminUpdate(input: {
  title: string;
  message: string;
  isActive: boolean;
  createdBy?: string | null;
}) {
  const { data, error } = await supabase
    .from(UPDATES_TABLE)
    .insert({
      title: input.title.trim(),
      message: input.message.trim(),
      is_active: input.isActive,
      created_by: input.createdBy || null,
    })
    .select("id, title, message, is_active, created_at, created_by")
    .single();

  if (error) {
    throw error;
  }

  return mapUpdate(data as Partial<AdminUpdateRecord>);
}

export async function updateAdminUpdate(input: {
  id: string;
  title: string;
  message: string;
  isActive: boolean;
}) {
  const { data, error } = await supabase
    .from(UPDATES_TABLE)
    .update({
      title: input.title.trim(),
      message: input.message.trim(),
      is_active: input.isActive,
    })
    .eq("id", input.id)
    .select("id, title, message, is_active, created_at, created_by")
    .single();

  if (error) {
    throw error;
  }

  return mapUpdate(data as Partial<AdminUpdateRecord>);
}

export async function deleteAdminUpdate(updateId: string) {
  const { error } = await supabase
    .from(UPDATES_TABLE)
    .delete()
    .eq("id", updateId);

  if (error) {
    throw error;
  }
}

export async function toggleAdminUpdateStatus(updateId: string, isActive: boolean) {
  const { data, error } = await supabase
    .from(UPDATES_TABLE)
    .update({ is_active: isActive })
    .eq("id", updateId)
    .select("id, title, message, is_active, created_at, created_by")
    .single();

  if (error) {
    throw error;
  }

  return mapUpdate(data as Partial<AdminUpdateRecord>);
}
