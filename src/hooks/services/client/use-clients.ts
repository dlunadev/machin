import { ClientUseCase } from "@/sdk/application/client/client.use-case";
import { Client } from "@/sdk/domain/client/client.entity";
import { ClientSupabaseAdapter } from "@/sdk/infraestructure";
import useSWRInfinite from "swr/infinite";

const client = new ClientSupabaseAdapter();
const service = new ClientUseCase(client);

export const useClients = (page_size: number, search_term: string, zone_id?: string) => {
  const getKey = (pageIndex: number, previousPageData: Client[] | null) => {
    if (previousPageData && previousPageData.length === 0) return null;
    return {
      page: pageIndex + 1,
      search_term,
      zone_id
    };
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    (params) => service.find_all(params),
    { revalidateFirstPage: true }
  );

  const isEmpty = data?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < page_size);

  const loadMore = () => {
    if (!isReachingEnd) setSize(size + 1);
  };

  return {
    clients: data ? data.flatMap((page) => page) : [],
    error,
    isLoading: (!data && !error) || isLoading,
    loadMore,
    isReachingEnd,
  };
};
