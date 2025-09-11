import { Client } from "@/sdk/domain/client/client.entity";
import { ClientRepository } from "@/sdk/domain/client/client.repository";
import { supabase } from "@/sdk/supabase/config";
import { Pagination } from "@/sdk/utils/type/pagination";

export class ClientSupabaseAdapter implements ClientRepository {
  async create(data: Client): Promise<Client> {
    const { data: createdData, error } = await supabase
      .from('clients')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return createdData;
  }

  async find_all(props: Pagination & { zone_id?: string }): Promise<Client[]> {
    const { page = 0, search_term, zone_id } = props;
    const page_size = 10;
    const from = (page - 1) * page_size;
    const to = from + page_size - 1;


    let query = supabase.from("clients").select("*");

    if (zone_id) {
      query = query.eq("zone_id", zone_id);
    }

    if (search_term && search_term.trim().length > 1) {
      query = query.ilike("name", `%${search_term}%`);
    }


    const { data, error } = await query.range(from, to);

    if (error) throw error;

    return data;
  }


  async find_by_id(id: string): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async update(id: string, data: Partial<Client>): Promise<Client> {
    const { data: updatedData, error } = await supabase
      .from('clients')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return updatedData;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}