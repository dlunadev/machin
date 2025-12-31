import { Shift } from "@/sdk/domain/shift/shift.entity";
import { Zone } from "@/sdk/domain/zone/zone.entity";
import { ShiftStatus } from "@/sdk/utils/enum/shift-status";

export type TurnHeaderProps = {
  zone_id: string | Zone | null;
  title?: string;
  state?: ShiftStatus;
  shift: Shift | null;
}