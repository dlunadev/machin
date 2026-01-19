import { ZoneSupabaseAdapter } from "@/sdk/infraestructure/zone/zone.supabase";
import useSWR from "swr";

const { find_by_id } = new ZoneSupabaseAdapter();

export const useZone = (zone_id?: string) => {
  const { data, isLoading, error } = useSWR(
    zone_id ? `zone-${zone_id}` : null,
    () => find_by_id(zone_id!),
  );

  console.log('zone', data, zone_id);

  return {
    zone: data,
    isLoading,
    error
  };
};
