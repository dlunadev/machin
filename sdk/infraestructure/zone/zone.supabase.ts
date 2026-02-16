import { Zone } from "@/sdk/domain/zone/zone.entity";
import { ZoneRepository } from "@/sdk/domain/zone/zone.repository";
import { supabase } from "@/sdk/supabase/config";
import { Pagination } from "@/sdk/utils/type/pagination";

export class ZoneSupabaseAdapter implements ZoneRepository {
  
  async create(data: Zone): Promise<Zone> {
    const { data: zone, error } = await supabase
      .from("zones")
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return zone;
  }

  async find_all(pagination: Pagination): Promise<Zone[]> {
    const { page = 1 } = pagination;
    const page_size = 10;
    const from = (page - 1) * page_size;
    const to = from + page_size - 1;

    const { data, error } = await supabase
      .from("zones")
      .select("*")
      .range(from, to);

    if (error) throw error;
    return data || [];
  }

  async find_by_id(id: string): Promise<Zone> {
    const { data, error } = await supabase
      .from("zones")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, data: Partial<Zone>): Promise<Zone> {
    const { data: zone, error } = await supabase
      .from("zones")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return zone;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("zones")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async get_zones({ page = 1, search_term }: Pagination): Promise<Zone[]> {
    const page_size = 10;
    const from = (page - 1) * page_size;
    const to = from + page_size - 1;

    let query = supabase
      .from("zones")
      .select("*")
      .range(from, to);

    if (search_term && search_term.trim().length > 1) {
      query = query.ilike("name", `%${search_term}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }
}
