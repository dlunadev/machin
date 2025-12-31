import { ShiftClients } from "@/sdk/domain/shift-clients/shift-clients.entity";
import { ShiftClientRepository } from "@/sdk/domain/shift-clients/shift-clients.repository";
import { Pagination } from "@/sdk/utils/type/pagination";

export class ShiftClientsUseCase implements ShiftClientRepository {
  constructor(private readonly repository: ShiftClientRepository) { }
  
  create(data: ShiftClients): Promise<ShiftClients> {
    return this.repository.create(data);
  }
  
  create_clients_shift(shift_id: string, payload: ShiftClients[]): Promise<ShiftClients[]> {
    return this.repository.create_clients_shift(shift_id, payload);
  }
  
  find_all(data: Pagination): Promise<ShiftClients[]> {
    return this.repository.find_all(data);
  }
  
  find_by_id(id: string): Promise<ShiftClients> {
    return this.repository.find_by_id(id);
  }
  
  update(id: string, data: Partial<ShiftClients>): Promise<ShiftClients> {
    return this.repository.update(id, data);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
