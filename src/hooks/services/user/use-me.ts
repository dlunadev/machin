import { get_seller_by_email } from "@/sdk/services/sellers/sellers";
import useSWR from "swr";


export const useMe = () => {
  const { data, isLoading, error } = useSWR('user', get_seller_by_email);

  return {
    user: data,
    isLoading,
    error
  }
}