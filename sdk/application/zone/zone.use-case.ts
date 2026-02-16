import { Zone } from "@/sdk/domain/zone/zone.entity";
import { ZoneRepository } from "@/sdk/domain/zone/zone.repository";
import { Pagination } from "@/sdk/utils/type/pagination";

export class ZoneUseCase implements ZoneRepository {
  constructor(
    private readonly repository: ZoneRepository
  ) { }

  async create(data: Zone): Promise<Zone> {
    return this.repository.create(data);
  }

  async find_all(data: Pagination): Promise<Zone[]> {
    return this.repository.find_all(data);
  }

  async find_by_id(id: string): Promise<Zone> {
    return this.repository.find_by_id(id);
  }

  async update(id: string, data: Partial<Zone>): Promise<Zone> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async get_zones(data: Pagination): Promise<Zone[]> {
    return this.repository.get_zones(data);
  }
}
