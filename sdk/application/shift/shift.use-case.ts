import { Shift } from "@/sdk/domain/shift/shift.entity";
import { ShiftRepository } from "@/sdk/domain/shift/shift.repository";
import { Pagination } from "@/sdk/utils/type/pagination";

export class ShiftUseCase implements ShiftRepository {
  constructor(
    private readonly repository: ShiftRepository
  ) { }

  create(data: Shift): Promise<Shift> {
    const shift = new Shift(
      data.zone_id,
      data.seller_id,
      data.status
    );
    return this.repository.create(shift);
  }

  find_all(data: Pagination): Promise<Shift[]> {
    return this.repository.find_all(data);
  }

  find_by_id(id: string): Promise<Shift> {
    return this.repository.find_by_id(id);
  }

  update(id: string, data: Partial<Shift>): Promise<Shift> {
    return this.repository.update(id, data);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  get_active_shifts(user_id: string): Promise<Shift> {
    return this.repository.get_active_shifts(user_id);
  }
}