import { Repository } from "@/sdk/utils/interface/repository";
import { Shift } from "./shift.entity";

export interface ShiftRepository extends Repository<Shift> {
  get_active_shifts(user_id: string): Promise<Shift | null>;
}
