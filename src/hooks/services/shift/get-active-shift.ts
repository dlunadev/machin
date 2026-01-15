import { ShiftUseCase } from "@/sdk/application/shift/shift.use-case";
import { ShiftMockAdapter } from "@/sdk/infraestructure";
import useSWR from "swr";

const mock = new ShiftMockAdapter();
const service = new ShiftUseCase(mock);

export const useShiftActive = (user_id?: string) => {
  const { data, isLoading, error, mutate } = useSWR(
    user_id ? `active-shift-${user_id}` : null,
    () => service.get_active_shifts(user_id!),
  );

  return {
    active_shift: data || null,
    isLoading,
    error,
    mutate
  };
};
