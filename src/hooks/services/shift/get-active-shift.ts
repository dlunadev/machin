import { ShiftSupabaseAdapter } from "@/sdk/infraestructure/shift/supabase/shift.supabase";
import useSWR from "swr";

const { get_active_shifts } = new ShiftSupabaseAdapter();

export const useShiftActive = (user_id?: string) => {
  const { data, isLoading, error } = useSWR(
    user_id ? `active-shift-${user_id}` : null,
    () => get_active_shifts(user_id!),
  );

  return {
    active_shift: data,
    isLoading,
    error
  };
};
