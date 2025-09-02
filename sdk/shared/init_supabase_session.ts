import { supabase } from "../supabase/config";
import { getToken } from "./session_storage";

export const initSupabaseSession = async () => {
  const session = await getToken();
  if (session) {
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  }
};
