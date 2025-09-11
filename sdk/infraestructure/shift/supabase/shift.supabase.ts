import { Shift } from "@/sdk/domain/shift/shift.entity";
import { ShiftRepository } from "@/sdk/domain/shift/shift.repository";
import { supabase } from "@/sdk/supabase/config";
import { ShiftStatus } from "@/sdk/utils/enum/shift-status";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pagination } from "@supabase/supabase-js";

export class ShiftSupabaseAdapter implements ShiftRepository {
  async find_all(data: Pagination): Promise<Shift[]> {
    return {};
  };

  async find_by_id(id: string): Promise<Shift> {

    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('id', id)

    if (error) throw error;

    return data[0];
  }

  async update(id: string, action: Partial<Shift>): Promise<Shift> {
    const { data, error } = await supabase.from('shifts').update({ status: action.status }).eq('id', id).select();

    if (error) throw error;

    return data;
  };

  async delete(id: string): Promise<void> {
    return {}
  };

  async create({ seller_id, zone_id }: { seller_id: string, zone_id: string }): Promise<Shift> {
    const { data, error } = await supabase
      .from('shifts')
      .insert([
        { seller_id: seller_id, zone_id: zone_id },
      ])
      .select()

    await AsyncStorage.setItem('shift_id', JSON.stringify(data[0].id));

    if (error) throw error;

    return data[0];
  };

  async get_active_shifts(user_id: string): Promise<Shift> {
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