import { supabase } from "../../supabase/config";
import { getToken } from "./session_storage";

export const restoreSession = async () => {
  const session = await getToken();
  if (session) {
    const { data } = await supabase.auth.setSession(session);
    return data.session;
  }
  return null;
};
