import { Zone } from "@/sdk/domain/zone/zone.entity";
import { ZoneRepository } from "@/sdk/domain/zone/zone.repository";
import { Pagination } from "@/sdk/utils/type/pagination";

export class ZoneUseCase implements ZoneRepository {
  constructor(
    private readonly repository: ZoneRepository
  ) { }

  get_zones({ page, search_term }: Pagination): Promise<Zone[]> {
    return this.repository.get_zones({ page, search_term });
  }
}