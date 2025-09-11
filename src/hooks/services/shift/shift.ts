
import { ShiftSupabaseAdapter } from "@/sdk/infraestructure/shift/supabase/shift.supabase";
import useSWR from "swr";

const { find_by_id } = new ShiftSupabaseAdapter();

export const useShift = (id: string) => {
  const { data, isLoading, error, mutate } = useSWR(
    id ? `shift-${id}` : null,
    () => find_by_id(id),
  );

  return {
    shift: data,
    isLoading,
    error,
    mutate
  }
}