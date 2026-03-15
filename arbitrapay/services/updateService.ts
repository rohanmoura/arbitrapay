import { supabase } from "@/lib/supabase";

export type UpdateRecord = {
  id: string;
  title: string;
  message: string;
  created_by: string | null;
  is_active: boolean | null;
  created_at: string | null;
};

export async function fetchActiveUpdates() {
  const { data, error } = await supabase
    .from("updates")
    .select("id, title, message, created_by, is_active, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []) as UpdateRecord[];
}
