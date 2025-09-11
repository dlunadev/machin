import { ShiftStatusRepository } from "@/sdk/domain/shift-status/shift-status-repository";
import { ShiftStatus } from "@/sdk/domain/shift-status/shift-status.entity";
import { Pagination } from "@supabase/supabase-js";

export class ShiftStatusUseCase implements ShiftStatusRepository {
  constructor(private readonly repository: ShiftStatusRepository) { }

  async create(data: ShiftStatus): Promise<ShiftStatus> {
    return this.repository.create(data);
  }

  async find_all(data: Pagination): Promise<ShiftStatus[]> {
    return this.repository.find_all(data);
  }

  async find_by_id(id: string): Promise<ShiftStatus> {
    return this.repository.find_by_id(id);
  }

  async update(id: string, data: ShiftStatus): Promise<ShiftStatus> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}