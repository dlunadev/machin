import { ShiftStatus as ShiftStatusEnum } from "@/sdk/utils/enum/shift-status";

export class ShiftStatusEntity {
  constructor(
    public action: ShiftStatusEnum,
    public shift_id: string,
    public id?: string,
  ) {}
}