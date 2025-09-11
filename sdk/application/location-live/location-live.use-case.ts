import { LocationLive } from "@/sdk/domain/location-live/location-live.entity";
import { LocationLiveRepository } from "@/sdk/domain/location-live/location-live.repository";
import { Pagination } from "@supabase/supabase-js";

export class LocationLiveUseCase implements LocationLiveRepository {
  constructor(
    private readonly repository: LocationLiveRepository
  ) { }
  create(data: LocationLive): Promise<LocationLive> {
    return this.repository.create(data);
  };
  find_all: (data: Pagination) => Promise<LocationLive[]>;
  find_by_id: (id: string) => Promise<LocationLive>;
  update(id: string, data: LocationLive): Promise<LocationLive> {
    return this.repository.update(id, data);
  };
  delete: (id: string) => Promise<void>;

}