import { LocationLive } from "@/sdk/domain/location-live/location-live.entity";
import { LocationLiveRepository } from "@/sdk/domain/location-live/location-live.repository";
import { supabase } from "@/sdk/supabase/config";
import { Pagination } from "@supabase/supabase-js";

export class LocationAdapter implements LocationLiveRepository {
  find_all: (data: Pagination) => Promise<LocationLive[]>;
  find_by_id: (id: string) => Promise<LocationLive>;
  update: (id: string, data: LocationLive) => Promise<LocationLive>;
  delete: (id: string) => Promise<void>;
  async create(payload: LocationLive): Promise<LocationLive> {
    const { data, error } = await supabase
      .from('location_live')
      .insert([
        { latitude: payload.latitude, longitude: payload.longitude, accuracy: payload.accuracy, shift_id: payload.shift_id },
      ])
      .select()

    if (error) throw error;

    return data;
  }
}