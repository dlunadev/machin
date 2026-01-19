import { ShiftUseCase } from "@/sdk/application/shift/shift.use-case";
import { ShiftSupabaseAdapter } from "@/sdk/infraestructure";
import useSWR from "swr";

const shift = new ShiftSupabaseAdapter();
const service = new ShiftUseCase(shift);

export const useShiftActive = (user_id?: string) => {
  const { data, isLoading, error, mutate } = useSWR(
    user_id ? `active-shift-${user_id}` : null,
    () => service.get_active_shifts(user_id!),
  );

  console.log('active shift', data)

  return {
    active_shift: data || null,
    isLoading,
    error,
    mutate
  };
};
