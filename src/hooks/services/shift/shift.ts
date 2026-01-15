
import { ShiftUseCase } from "@/sdk/application/shift/shift.use-case";
import { ShiftMockAdapter } from "@/sdk/infraestructure";
import useSWR from "swr";

const mock = new ShiftMockAdapter();
const service = new ShiftUseCase(mock);

export const useShift = (id: string) => {
  const { data, isLoading, error, mutate } = useSWR(
    id ? `shift-${id}` : null,
    () => service.find_by_id(id),
  );

  console.log(data);

  return {
    shift: data,
    isLoading,
    error,
    mutate
  }
}