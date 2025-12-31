import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import Constants from 'expo-constants';

const supabaseUrl = Constants?.expoConfig?.extra?.SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = Constants?.expoConfig?.extra?.SUPABASE_KEY || "dummy-key-for-mock-development";

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
