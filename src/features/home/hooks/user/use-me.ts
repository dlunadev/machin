import { get_seller_by_email } from "@/sdk/services/sellers/sellers";
import { User } from "@/src/features/home/model";
import useSWR from "swr";


export const useMe = () => {
  const { data, isLoading, error } = useSWR('user', get_seller_by_email);

  return {
    user: data as User,
    isLoading,
    error
  }
}