import { supabase } from "@/lib/supabase";

export type SupportTicketRecord = {
  id: string;
  user_id: string;
  category: string;
  subject: string;
  message: string;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export async function createSupportTicket(input: {
  userId: string;
  category: string;
  subject: string;
  message: string;
}) {
  const { error } = await supabase
    .from("support_tickets")
    .insert({
      user_id: input.userId,
      category: input.category,
      subject: input.subject,
      message: input.message,
      status: "pending",
    });

  if (error) {
    throw new Error(error.message || "Unable to submit your support ticket. Please try again.");
  }
}
