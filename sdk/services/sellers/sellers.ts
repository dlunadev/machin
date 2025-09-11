import { Seller } from "@/sdk/domain/seller/seller.entity";
import { supabase } from "@/sdk/supabase/config";

export const get_seller_by_email = async (): Promise<Seller | null> => {
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
