import { Zone } from "@/sdk/domain/zone/zone.entity";
import { ZoneRepository } from "@/sdk/domain/zone/zone.repository";
import { supabase } from "@/sdk/supabase/config";
import { Pagination } from "@/sdk/utils/type/pagination";

export class ZoneSupabaseAdapter implements ZoneRepository {
  // create: (data: Zone) => Promise<Zone>;
  // find_all: (data: Pagination) => Promise<Zone[]>;
  async find_by_id(id: string): Promise<Zone> {
    const { data, error } = await supabase.from("zones").select("*").eq("id", id).single();

    if (error) throw error;

    return data;
  };
  // update: (id: string, data: Zone) => Promise<Zone>;
  // delete: (id: string) => Promise<void>;
  get_zones = async ({ page, search_term }: Pagination): Promise<Zone[]> => {
    const page_size = 10;
    const from = (page - 1) * page_size;
    const to = from + page_size - 1;

    let query = supabase.from("zones").select("*").range(from, to);

    if (search_term && search_term.trim().length > 1) {
      query = query.ilike("name", `%${search_term}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  };
}