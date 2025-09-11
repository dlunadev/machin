import { ShiftClients } from "@/sdk/domain/shift-clients/shift-clients.entity";
import { ShiftClientRepository } from "@/sdk/domain/shift-clients/shift-clients.repository";
import { supabase } from "@/sdk/supabase/config";
import { Pagination } from "@/sdk/utils/type/pagination";

export class ShiftClientAdapter implements ShiftClientRepository {
  create(data: ShiftClients): Promise<ShiftClients> {
    throw new Error("Method not implemented.");
  }
  async create_clients_shift(shift_id: string, payload: ShiftClients[]): Promise<ShiftClients> {
    const { data, error } = await supabase
      .from('shift_clients')
      .insert(
        payload.map((c) => ({
          shift_id,
          client_id: c.client_id,
          order: c.order,
        }))
      )
      .select();

    if (error) throw error;

    return data;
  }
  find_all(data: Pagination): Promise<ShiftClients[]> {
    throw new Error("Method not implemented.");
  }
  find_by_id(id: string): Promise<ShiftClients> {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: Partial<ShiftClients>): Promise<ShiftClients> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

}