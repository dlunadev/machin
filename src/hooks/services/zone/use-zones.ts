import { ZoneUseCase } from '@/sdk/application/zone/zone.use-case';
import { Zone } from '@/sdk/domain/zone/zone.entity';
import { ZoneSupabaseAdapter } from '@/sdk/infraestructure';
import useSWRInfinite from 'swr/infinite';

const zone = new ZoneSupabaseAdapter();
const service = new ZoneUseCase(zone);

export const useZones = (page_size: number, search_term: string) => {
  const getKey = (pageIndex: number, previousPageData: Zone[] | null) => {
    if (previousPageData && previousPageData.length === 0) return null;
    return ['zones', pageIndex + 1, search_term];
  };

  const { data, error, isLoading, isValidating, mutate, size, setSize } = useSWRInfinite<Zone[]>(getKey, ([, page, search_term]) => service.get_zones({ page, search_term }), {
    revalidateFirstPage: true,
  });

  const zones: Zone[] = data ? data.flat() : [];

  const isEmpty = zones.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < page_size);

  const loadMore = () => {
    if (!isReachingEnd) setSize(size + 1);
  };

  return {
    zones,
    error,
    isLoading: (!data && !error) || isLoading,
    mutate,
    loadMore,
    isReachingEnd,
    isValidating,
  };
};
