import { supabase } from "@/sdk/supabase/config";
import { User } from "@/src/features/home/model";

export const get_seller_by_email = async (): Promise<User | null> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) return null;

  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  return data;
}
