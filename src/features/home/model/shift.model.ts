import { ShiftStatus } from "@/sdk/utils/enum/shift-status";

export interface Shift {
  zone_id: string;
  seller_id: string;
  status: ShiftStatus;
  id?: string | null;
  active_hours?: number;
  route?: string;
  distance?: number;
  created_at?: Date;
}

export function toShiftViewModel(shift: Shift) {
  return {
    zone_id: shift.zone_id,
    seller_id: shift.seller_id,
    status: shift.status,
    id: shift.id,
    active_hours: shift.active_hours,
    route: shift.route,
    distance: shift.distance,
    created_at: shift.created_at,
  };
}
