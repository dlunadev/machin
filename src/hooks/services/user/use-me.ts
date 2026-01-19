import { get_seller_by_email_mocked } from "@/sdk/services/sellers/user.mock";
import useSWR from "swr";


export const useMe = () => {
  const { data, isLoading, error } = useSWR('user', get_seller_by_email_mocked);

  return {
    user: data,
    isLoading,
    error
  }
}