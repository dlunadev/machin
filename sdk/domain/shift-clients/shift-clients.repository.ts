import { Repository } from "@/sdk/utils/interface/repository";
import { ShiftClients } from "./shift-clients.entity";

export interface ShiftClientRepository extends Repository<ShiftClients> {
  create_clients_shift(shift_id: string, payload: ShiftClients[]): Promise<ShiftClients[]>;
}