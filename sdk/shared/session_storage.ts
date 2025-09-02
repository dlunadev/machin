import { Session } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const SUPABASE_TOKEN = process.env.SUPABASE_TOKEN as string;

export const saveToken = async (session: Session) => {
  await SecureStore.setItemAsync(SUPABASE_TOKEN, JSON.stringify(session));
};

export const getToken = async () => {
  const session = await SecureStore.getItemAsync(SUPABASE_TOKEN);
  return session ? JSON.parse(session) : null;
};

export const deleteToken = async () => {
  await SecureStore.deleteItemAsync(SUPABASE_TOKEN);
};
