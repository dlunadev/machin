import useSWR from "swr";
import { zone_service } from "../../domain/services/home.services";


export const useZone = (zone_id?: string) => {
  const { data, isLoading, error } = useSWR(
    zone_id ? `zone-${zone_id}` : null,
    () => zone_service.find_by_id(zone_id!),
  );

  return {
    zone: data,
    isLoading,
    error
  };
};
