import { ShiftStatusRepository } from "@/sdk/domain/shift-status/shift-status-repository";
import { ShiftStatusEntity } from "@/sdk/domain/shift-status/shift-status.entity";
import { supabase } from "@/sdk/supabase/config";
import { Pagination } from "@/sdk/utils/type/pagination";

export class ShiftStatusAdapter implements ShiftStatusRepository {
  async create(shift: ShiftStatusEntity): Promise<ShiftStatusEntity> {
    const { data, error } = await supabase
      .from('shifts_status')
      .insert([
        {
          shift_id: shift.shift_id,
          action: shift.action,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async find_all(props: Pagination): Promise<ShiftStatusEntity[]> {
    const { page = 1 } = props;
    const page_size = 10;
    const from = (page - 1) * page_size;
    const to = from + page_size - 1;

    const { data, error } = await supabase
      .from('shifts_status')
      .select('*')
      .range(from, to);

    if (error) throw error;

    return data || [];
  }

  async find_by_id(id: string): Promise<ShiftStatusEntity> {
    const { data, error } = await supabase
      .from('shifts_status')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Update - En realidad crea un nuevo registro de estado
   * El historial no se edita, se agregan nuevos registros
   */
  async update(id: string, data: Partial<ShiftStatusEntity>): Promise<ShiftStatusEntity> {
    // En lugar de update, creamos un nuevo registro
    const { data: newStatus, error } = await supabase
      .from("shifts_status")
      .insert({
        shift_id: id,
        action: data.action,
      })
      .select()
      .single();

    if (error) throw error;

    return newStatus;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('shifts_status')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
