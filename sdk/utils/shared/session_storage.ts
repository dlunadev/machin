import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const SUPABASE_TOKEN = Constants?.expoConfig?.extra?.SUPABASE_KEY as string;

export const saveToken = async (session: Session) => {
  const payload = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  };
  await AsyncStorage.setItem(SUPABASE_TOKEN, JSON.stringify(payload));
};

export const getToken = async () => {
  const session = await AsyncStorage.getItem(SUPABASE_TOKEN);
  return session ? JSON.parse(session) : null;
};

export const deleteToken = async () => {
  await AsyncStorage.removeItem(SUPABASE_TOKEN);
};
