import { ShiftStatusRepository } from "@/sdk/domain/shift-status/shift-status-repository";
import { ShiftStatusEntity } from "@/sdk/domain/shift-status/shift-status.entity";
import { Pagination } from "@/sdk/utils/type/pagination";

export class ShiftStatusUseCase implements ShiftStatusRepository {
  constructor(private readonly repository: ShiftStatusRepository) { }

  async create(data: ShiftStatusEntity): Promise<ShiftStatusEntity> {
    return this.repository.create(data);
  }

  async find_all(data: Pagination): Promise<ShiftStatusEntity[]> {
    return this.repository.find_all(data);
  }

  async find_by_id(id: string): Promise<ShiftStatusEntity> {
    return this.repository.find_by_id(id);
  }

  async update(id: string, data: Partial<ShiftStatusEntity>): Promise<ShiftStatusEntity> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
