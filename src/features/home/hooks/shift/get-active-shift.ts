import useSWR from 'swr';
import { shift_service } from '../../domain/services/home.services';

export const useShiftActive = (user_id?: string) => {
  const { data, isLoading, error, mutate } = useSWR(user_id ? `active-shift-${user_id}` : null, () => shift_service.get_active_shifts(user_id!));

  console.log('active shift', data);

  return {
    active_shift: data || null,
    isLoading,
    error,
    mutate,
  };
};
