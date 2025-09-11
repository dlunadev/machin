import { AuthError, Session, User } from "@supabase/supabase-js";
import { supabase } from "../../supabase/config";
import { deleteToken, saveToken } from "../../utils/shared/session_storage";

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

export const recovery_password = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if(error) throw error;

  return data;
}

export const update_password = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({ password });
 
  if (error) throw error;
 
  return data;
}

supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    saveToken(session);
  } else {
    deleteToken();
  }
});