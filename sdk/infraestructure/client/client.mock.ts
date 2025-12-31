import { Client } from "@/sdk/domain/client/client.entity";
import { ClientRepository } from "@/sdk/domain/client/client.repository";
import { Pagination } from "@/sdk/utils/type/pagination";

/**
 * Mock Client Adapter - Simula operaciones CRUD con delays y errores aleatorios
 */
export class ClientMockAdapter implements ClientRepository {
  private readonly ERROR_RATE = 0.1; // 10% de probabilidad de error
  private readonly MIN_DELAY = 300; // ms
  private readonly MAX_DELAY = 1200; // ms
  
  // Base de datos en memoria
  private mockClients: Client[] = [
    new Client(
      "client-001",
      -34.6037,
      -58.3816,
      "Carrefour Express Palermo",
      true,
      "Av. Santa Fe 3253",
      "Carrefour Express",
      "zone-001",
      "Palermo"
    ),
    new Client(
      "client-002",
      -34.6158,
      -58.4333,
      "Día % Villa Crespo",
      true,
      "Av. Corrientes 5402",
      "Día %",
      "zone-001",
      "Villa Crespo"
    ),
    new Client(
      "client-003",
      -34.5889,
      -58.3964,
      "Coto Belgrano",
      true,
      "Av. Cabildo 2040",
      "Coto",
      "zone-002",
      "Belgrano"
    ),
    new Client(
      "client-004",
      -34.5992,
      -58.3733,
      "Disco Recoleta",
      false,
      "Av. Las Heras 2155",
      "Disco",
      "zone-002",
      "Recoleta"
    ),
    new Client(
      "client-005",
      -34.6280,
      -58.3857,
      "Supermercado Vital Caballito",
      true,
      "Av. Rivadavia 5430",
      "Vital",
      "zone-003",
      "Caballito"
    ),
    new Client(
      "client-006",
      -34.6037,
      -58.4458,
      "Carrefour Market Almagro",
      true,
      "Av. Corrientes 4247",
      "Carrefour Market",
      "zone-003",
      "Almagro"
    ),
    new Client(
      "client-007",
      -34.6378,
      -58.3937,
      "Día % Flores",
      true,
      "Av. Rivadavia 6850",
      "Día %",
      "zone-003",
      "Flores"
    ),
    new Client(
      "client-008",
      -34.5709,
      -58.4537,
      "Coto Núñez",
      true,
      "Av. Cabildo 4290",
      "Coto",
      "zone-002",
      "Núñez"
    ),
    new Client(
      "client-009",
      -34.6114,
      -58.3707,
      "Jumbo Barrio Norte",
      true,
      "Av. Santa Fe 1885",
      "Jumbo",
      "zone-001",
      "Barrio Norte"
    ),
    new Client(
      "client-010",
      -34.6445,
      -58.4647,
      "Disco Parque Chacabuco",
      false,
      "Av. Eva Perón 1425",
      "Disco",
      "zone-003",
      "Parque Chacabuco"
    ),
    new Client(
      "client-011",
      -34.5511,
      -58.4583,
      "Carrefour Express Saavedra",
      true,
      "Av. García del Río 3150",
      "Carrefour Express",
      "zone-002",
      "Saavedra"
    ),
    new Client(
      "client-012",
      -34.6037,
      -58.4150,
      "Supermercado Día Abasto",
      true,
      "Av. Corrientes 3247",
      "Día %",
      "zone-001",
      "Abasto"
    ),
    new Client(
      "client-013",
      -34.5785,
      -58.3858,
      "Coto Colegiales",
      true,
      "Av. Federico Lacroze 2301",
      "Coto",
      "zone-002",
      "Colegiales"
    ),
    new Client(
      "client-014",
      -34.6590,
      -58.4685,
      "Carrefour Market Mataderos",
      true,
      "Av. Lisandro de la Torre 755",
      "Carrefour Market",
      "zone-003",
      "Mataderos"
    ),
    new Client(
      "client-015",
      -34.5961,
      -58.4272,
      "Vital Villa Ortúzar",
      true,
      "Av. Álvarez Thomas 655",
      "Vital",
      "zone-002",
      "Villa Ortúzar"
    ),
  ];

  /**
   * Simula un delay aleatorio de red
   */
  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * (this.MAX_DELAY - this.MIN_DELAY) + this.MIN_DELAY;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Simula errores aleatorios
   */
  private shouldSimulateError(): boolean {
    return Math.random() < this.ERROR_RATE;
  }

  /**
   * Genera un ID único
   */
  private generateId(): string {
    return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create - Crear un nuevo cliente
   */
  async create(data: Client): Promise<Client> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error de red al crear cliente');
    }

    // Validaciones
    if (!data.name || data.name.trim().length < 3) {
      throw new Error('El nombre debe tener al menos 3 caracteres');
    }

    if (!data.address || data.address.trim().length < 5) {
      throw new Error('La dirección debe tener al menos 5 caracteres');
    }

    // Crear cliente con ID generado
    const newClient = new Client(
      this.generateId(),
      data.latitude,
      data.longitude,
      data.name,
      data.active ?? true,
      data.address,
      data.store,
      data.zone_id,
      data.locality
    );

    this.mockClients.push(newClient);
    console.log('✅ Cliente creado:', newClient.name);
    
    return newClient;
  }

  /**
   * Find All - Obtener todos los clientes con paginación y filtros
   */
  async find_all(props: Pagination & { zone_id?: string }): Promise<Client[]> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al obtener clientes');
    }

    const { page = 1, search_term, zone_id } = props;
    const page_size = 10;
    
    let filteredClients = [...this.mockClients];

    // Filtrar por zona
    if (zone_id) {
      filteredClients = filteredClients.filter(c => c.zone_id === zone_id);
    }

    // Filtrar por búsqueda
    if (search_term && search_term.trim().length > 1) {
      const term = search_term.toLowerCase();
      filteredClients = filteredClients.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.address.toLowerCase().includes(term) ||
        c.store.toLowerCase().includes(term) ||
        c.locality.toLowerCase().includes(term)
      );
    }

    // Paginación
    const from = (page - 1) * page_size;
    const to = from + page_size;

    console.log(`📋 Obteniendo clientes - Página ${page}, Total: ${filteredClients.length}`);
    
    return filteredClients.slice(from, to);
  }

  /**
   * Find By Id - Obtener un cliente por ID
   */
  async find_by_id(id: string): Promise<Client> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al obtener cliente');
    }

    const client = this.mockClients.find(c => c.id === id);

    if (!client) {
      throw new Error(`Cliente con ID ${id} no encontrado`);
    }

    console.log('🔍 Cliente encontrado:', client.name);
    return client;
  }

  /**
   * Update - Actualizar un cliente
   */
  async update(id: string, data: Partial<Client>): Promise<Client> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al actualizar cliente');
    }

    const index = this.mockClients.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error(`Cliente con ID ${id} no encontrado`);
    }

    // Actualizar cliente
    const updatedClient = new Client(
      this.mockClients[index].id,
      data.latitude ?? this.mockClients[index].latitude,
      data.longitude ?? this.mockClients[index].longitude,
      data.name ?? this.mockClients[index].name,
      data.active ?? this.mockClients[index].active,
      data.address ?? this.mockClients[index].address,
      data.store ?? this.mockClients[index].store,
      data.zone_id ?? this.mockClients[index].zone_id,
      data.locality ?? this.mockClients[index].locality
    );

    this.mockClients[index] = updatedClient;
    console.log('✏️ Cliente actualizado:', updatedClient.name);

    return updatedClient;
  }

  /**
   * Delete - Eliminar un cliente
   */
  async delete(id: string): Promise<void> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al eliminar cliente');
    }

    const index = this.mockClients.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error(`Cliente con ID ${id} no encontrado`);
    }

    const deletedClient = this.mockClients[index];
    this.mockClients.splice(index, 1);
    console.log('🗑️ Cliente eliminado:', deletedClient.name);
  }

  /**
   * Utilidad: Reset de datos (para testing)
   */
  resetMockData(): void {
    this.mockClients = [...this.getInitialMockData()];
    console.log('🔄 Datos de clientes reseteados');
  }

  /**
   * Utilidad: Obtener datos iniciales
   */
  private getInitialMockData(): Client[] {
    return [
      new Client("client-001", -34.6037, -58.3816, "Carrefour Express Palermo", true, "Av. Santa Fe 3253", "Carrefour Express", "zone-001", "Palermo"),
      new Client("client-002", -34.6158, -58.4333, "Día % Villa Crespo", true, "Av. Corrientes 5402", "Día %", "zone-001", "Villa Crespo"),
      new Client("client-003", -34.5889, -58.3964, "Coto Belgrano", true, "Av. Cabildo 2040", "Coto", "zone-002", "Belgrano"),
      new Client("client-004", -34.5992, -58.3733, "Disco Recoleta", false, "Av. Las Heras 2155", "Disco", "zone-002", "Recoleta"),
      new Client("client-005", -34.6280, -58.3857, "Supermercado Vital Caballito", true, "Av. Rivadavia 5430", "Vital", "zone-003", "Caballito"),
      new Client("client-006", -34.6037, -58.4458, "Carrefour Market Almagro", true, "Av. Corrientes 4247", "Carrefour Market", "zone-003", "Almagro"),
      new Client("client-007", -34.6378, -58.3937, "Día % Flores", true, "Av. Rivadavia 6850", "Día %", "zone-003", "Flores"),
      new Client("client-008", -34.5709, -58.4537, "Coto Núñez", true, "Av. Cabildo 4290", "Coto", "zone-002", "Núñez"),
      new Client("client-009", -34.6114, -58.3707, "Jumbo Barrio Norte", true, "Av. Santa Fe 1885", "Jumbo", "zone-001", "Barrio Norte"),
      new Client("client-010", -34.6445, -58.4647, "Disco Parque Chacabuco", false, "Av. Eva Perón 1425", "Disco", "zone-003", "Parque Chacabuco"),
      new Client("client-011", -34.5511, -58.4583, "Carrefour Express Saavedra", true, "Av. García del Río 3150", "Carrefour Express", "zone-002", "Saavedra"),
      new Client("client-012", -34.6037, -58.4150, "Supermercado Día Abasto", true, "Av. Corrientes 3247", "Día %", "zone-001", "Abasto"),
      new Client("client-013", -34.5785, -58.3858, "Coto Colegiales", true, "Av. Federico Lacroze 2301", "Coto", "zone-002", "Colegiales"),
      new Client("client-014", -34.6590, -58.4685, "Carrefour Market Mataderos", true, "Av. Lisandro de la Torre 755", "Carrefour Market", "zone-003", "Mataderos"),
      new Client("client-015", -34.5961, -58.4272, "Vital Villa Ortúzar", true, "Av. Álvarez Thomas 655", "Vital", "zone-002", "Villa Ortúzar"),
    ];
  }
}
