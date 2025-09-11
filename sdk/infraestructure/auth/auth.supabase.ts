import { AuthRepository, AuthResponse } from "@/sdk/domain/auth/auth.repository";
import { User } from "@/sdk/domain/user/user.entity";
import { supabase } from "../../supabase/config";
import { deleteToken, saveToken } from "../../utils/shared/session_storage";

export class AuthSupabaseAdapter implements AuthRepository {
  sign_up = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const userEntity = User.fromDTO(data.user);
  
    return { data: { ...data, user: userEntity, }, error };
  };

  sign_in = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const userEntity = User.fromDTO(data.user);

    return { data: { ...data, user: userEntity, }, error };
  };

  sign_out = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  recovery_password = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'machin://password/new-password'
    });

    if (error) throw error;
    
    return data;
  }

  update_password = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) throw error;

    return data;
  }
}


supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    saveToken(session);
  } else {
    deleteToken();
  }
});