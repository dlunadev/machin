import { Pagination } from "@/sdk/utils/type/pagination";
import { supabase } from "../../supabase/config";

export const get_clients = async ({ page, search_term }: Pagination) => {
  const page_size = 10;
  const from = (page - 1) * page_size;
  const to = from + page_size - 1;

  let query = supabase.from("clients").select("*").range(from, to);

  if (search_term && search_term.trim().length > 1) {
    query = query.ilike("name", `%${search_term}%`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return { clients: data ?? [] };
};
