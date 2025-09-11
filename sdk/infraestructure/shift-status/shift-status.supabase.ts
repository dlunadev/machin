import { ShiftStatusRepository } from "@/sdk/domain/shift-status/shift-status-repository";
import { ShiftStatusEntity } from "@/sdk/domain/shift-status/shift-status.entity";
import { Shift } from "@/sdk/domain/shift/shift.entity";
import { supabase } from "@/sdk/supabase/config";
import { ShiftStatus } from "@/sdk/utils/enum/shift-status";
import { Pagination } from "@supabase/supabase-js";

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

    if (error) throw error;


    return data;
  }

  async find_all(data: Pagination): Promise<ShiftStatusEntity[]> {
    return this.repository.find_all(data);
  }

  async find_by_id(id: string): Promise<ShiftStatusEntity> {

    const { data, error } = await supabase
      .from('shifts_status')
      .eq('id', id)
      .select('*')

    if (error) throw error;

    return data;
  }

  /**
   * 
   * Hago los updates de status en SHIFT 
   * 
   * No deberia hacer update en shift_status
   */

  async update(id: string, action: ShiftStatus): Promise<Shift> {
    const { data, error } = await supabase
      .from("shifts_status")
      .insert({
        shift_id: id,
        action: action,
      })
      .eq("shift_id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

}