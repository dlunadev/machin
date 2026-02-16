import useSWR from 'swr';
import { shift_service } from '../../domain/services/home.services';

export const useShift = (id: string) => {
  const { data, isLoading, error, mutate } = useSWR(id ? `shift-${id}` : null, () => shift_service.find_by_id(id));

  console.log(data);

  return {
    shift: data,
    isLoading,
    error,
    mutate,
  };
};
