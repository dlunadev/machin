import { Client } from "@/sdk/domain/client/client.entity";
import { ClientRepository } from "@/sdk/domain/client/client.repository";
import { Pagination } from "@/sdk/utils/type/pagination";

export class ClientUseCase implements ClientRepository {
  constructor(private repository: ClientRepository) { }
  
  create(data: Client): Promise<Client> {
    return this.repository.create(data);
  }
  
  find_all(data: Pagination & { zone_id?: string }): Promise<Client[]> {
    return this.repository.find_all(data);
  }
  
  find_by_id(id: string): Promise<Client> {
    return this.repository.find_by_id(id);
  }
  
  update(id: string, data: Partial<Client>): Promise<Client> {
    return this.repository.update(id, data);
  }
  
  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
