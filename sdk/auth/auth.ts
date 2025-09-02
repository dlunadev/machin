import { AuthError, Session, User } from "@supabase/supabase-js";
import { deleteToken, saveToken } from "../shared/session_storage";
import { supabase } from "../supabase/config";

type AuthResponse = {
  data: {
    user: User | null;
    session: Session | null;
  };
  error: AuthError | null;
};

export const sign_up = async (email: string, password: string): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return { data, error };
};

export const sign_in = async (email: string, password: string): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { data, error };
};

export const sign_out = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    saveToken(session);
  } else {
    deleteToken();
  }
});