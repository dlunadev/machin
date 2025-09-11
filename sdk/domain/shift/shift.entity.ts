import { ShiftStatus } from "@/sdk/utils/enum/shift-status";

export class Shift {
  constructor(
    public zone_id: string,
    public seller_id: string,
    public status: ShiftStatus,
    public id?: string | null,
    public active_hours?: number,
    public route?: string,
    public distance?: number,
    public created_at?: Date,
  ) {}
}