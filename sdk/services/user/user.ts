import { supabase } from "../../supabase/config";

export const get_user = async () => {
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