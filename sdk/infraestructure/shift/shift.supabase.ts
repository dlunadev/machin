import { Shift } from "@/sdk/domain/shift/shift.entity";
import { ShiftRepository } from "@/sdk/domain/shift/shift.repository";
import { supabase } from "@/sdk/supabase/config";
import { ShiftStatus } from "@/sdk/utils/enum/shift-status";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pagination } from "@/sdk/utils/type/pagination";

export class ShiftSupabaseAdapter implements ShiftRepository {
  async find_all(data: Pagination): Promise<Shift[]> {
    const { page = 1 } = data;
    const page_size = 10;
    const from = (page - 1) * page_size;
    const to = from + page_size - 1;

    const { data: shifts, error } = await supabase
      .from('shifts')
      .select('*')
      .range(from, to);

    if (error) throw error;

    return shifts || [];
  }

  async find_by_id(id: string): Promise<Shift> {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  }

  async update(id: string, action: Partial<Shift>): Promise<Shift> {
    const { data, error } = await supabase
      .from('shifts')
      .update({ status: action.status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async create(data: Shift): Promise<Shift> {
    const { data: createdShift, error } = await supabase
      .from('shifts')
      .insert([
        { 
          seller_id: data.seller_id, 
          zone_id: data.zone_id,
          status: data.status
        },
      ])
      .select()
      .single();

    if (error) throw error;

    if (!createdShift) {
      throw new Error('No se pudo crear el shift');
    }

    await AsyncStorage.setItem('shift_id', JSON.stringify(createdShift.id));

    return createdShift;
  }

  async get_active_shifts(user_id: string): Promise<Shift | null> {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('seller_id', user_id)
      .neq("status", ShiftStatus.FINISHED)
      .maybeSingle();

    if (error) throw error;

    return data;
  }
}
