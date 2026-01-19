
import { ShiftUseCase } from "@/sdk/application/shift/shift.use-case";
import { ShiftSupabaseAdapter } from "@/sdk/infraestructure";
import useSWR from "swr";

const shift = new ShiftSupabaseAdapter();
const service = new ShiftUseCase(shift);

export const useShift = (id: string) => {
  const { data, isLoading, error, mutate } = useSWR(
    id ? `shift-${id}` : null,
    () => service.find_by_id(id),
  );

  return {
    shift: data,
    isLoading,
    error,
    mutate
  }
}