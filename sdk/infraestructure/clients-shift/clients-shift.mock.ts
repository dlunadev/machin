import { ShiftClients } from "@/sdk/domain/shift-clients/shift-clients.entity";
import { ShiftClientRepository } from "@/sdk/domain/shift-clients/shift-clients.repository";
import { Pagination } from "@/sdk/utils/type/pagination";

/**
 * Mock ShiftClient Adapter - Simula la asignación de clientes a turnos
 * Representa la ruta de clientes que un vendedor debe visitar en su turno
 */
export class ShiftClientMockAdapter implements ShiftClientRepository {
  private readonly ERROR_RATE = 0.08; // 8% de probabilidad de error
  private readonly MIN_DELAY = 300; // ms
  private readonly MAX_DELAY = 900; // ms
  
  // Base de datos en memoria - Relaciones shift -> clientes
  private mockShiftClients: ShiftClients[] = [];
  private shiftClientIdCounter = 1;

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
    return `shift-client-${Date.now()}-${this.shiftClientIdCounter++}`;
  }

  /**
   * Create - Crear una relación shift-cliente individual
   */
  async create(data: ShiftClients): Promise<ShiftClients> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al asignar cliente al shift');
    }

    const newShiftClient = new ShiftClients(
      data.client_id,
      data.order,
      this.generateId(),
      data.shift_id
    );

    this.mockShiftClients.push(newShiftClient);

    console.log(`✅ Cliente ${data.client_id} asignado al shift ${data.shift_id} (orden: ${data.order})`);
    
    return newShiftClient;
  }

  /**
   * Create Clients Shift - Asignar múltiples clientes a un shift (batch)
   * Este es el método principal que se usa para crear la ruta del turno
   */
  async create_clients_shift(shift_id: string, payload: ShiftClients[]): Promise<ShiftClients[]> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al asignar clientes al shift');
    }

    // Validar que no haya orden duplicado
    const orders = payload.map(p => p.order);
    const duplicates = orders.filter((order, index) => orders.indexOf(order) !== index);
    
    if (duplicates.length > 0) {
      throw new Error(`Orden duplicado detectado: ${duplicates.join(', ')}`);
    }

    // Crear todos los shift-clients
    const created: ShiftClients[] = [];
    
    for (const item of payload) {
      const newShiftClient = new ShiftClients(
        item.client_id,
        item.order,
        this.generateId(),
        shift_id
      );

      this.mockShiftClients.push(newShiftClient);
      created.push(newShiftClient);
    }

    console.log(`✅ ${created.length} clientes asignados al shift ${shift_id}`);
    
    return created;
  }

  /**
   * Find All - Obtener todas las relaciones shift-cliente
   */
  async find_all(props: Pagination): Promise<ShiftClients[]> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al obtener asignaciones');
    }

    const { page = 1 } = props;
    const page_size = 10;
    
    const from = (page - 1) * page_size;
    const to = from + page_size;

    console.log(`📋 Obteniendo shift-clients - Página ${page}, Total: ${this.mockShiftClients.length}`);
    
    return this.mockShiftClients.slice(from, to);
  }

  /**
   * Find By Id - Obtener una relación específica
   */
  async find_by_id(id: string): Promise<ShiftClients> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al obtener asignación');
    }

    const shiftClient = this.mockShiftClients.find(sc => sc.id === id);

    if (!shiftClient) {
      throw new Error(`ShiftClient con ID ${id} no encontrado`);
    }

    console.log('🔍 ShiftClient encontrado:', shiftClient.id);
    return shiftClient;
  }

  /**
   * Update - Actualizar una relación (cambiar orden, por ejemplo)
   */
  async update(id: string, data: Partial<ShiftClients>): Promise<ShiftClients> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al actualizar asignación');
    }

    const index = this.mockShiftClients.findIndex(sc => sc.id === id);

    if (index === -1) {
      throw new Error(`ShiftClient con ID ${id} no encontrado`);
    }

    const current = this.mockShiftClients[index];
    const updated = new ShiftClients(
      data.client_id ?? current.client_id,
      data.order ?? current.order,
      current.id,
      data.shift_id ?? current.shift_id
    );

    this.mockShiftClients[index] = updated;

    console.log('✏️ ShiftClient actualizado:', updated.id);
    return updated;
  }

  /**
   * Delete - Eliminar una relación shift-cliente
   */
  async delete(id: string): Promise<void> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al eliminar asignación');
    }

    const index = this.mockShiftClients.findIndex(sc => sc.id === id);

    if (index === -1) {
      throw new Error(`ShiftClient con ID ${id} no encontrado`);
    }

    this.mockShiftClients.splice(index, 1);
    console.log('🗑️ ShiftClient eliminado:', id);
  }

  /**
   * Utilidad: Obtener clientes de un shift específico (ordenados)
   */
  async getClientsForShift(shift_id: string): Promise<ShiftClients[]> {
    await this.simulateNetworkDelay();

    const clients = this.mockShiftClients
      .filter(sc => sc.shift_id === shift_id)
      .sort((a, b) => a.order - b.order);

    console.log(`🗺️ Ruta del shift ${shift_id}: ${clients.length} clientes`);
    
    return clients;
  }

  /**
   * Utilidad: Eliminar todos los clientes de un shift
   */
  async deleteAllClientsFromShift(shift_id: string): Promise<void> {
    await this.simulateNetworkDelay();

    const countBefore = this.mockShiftClients.length;
    this.mockShiftClients = this.mockShiftClients.filter(sc => sc.shift_id !== shift_id);
    const countAfter = this.mockShiftClients.length;
    const deleted = countBefore - countAfter;

    console.log(`🗑️ ${deleted} clientes eliminados del shift ${shift_id}`);
  }

  /**
   * Utilidad: Reordenar clientes de un shift
   */
  async reorderClients(shift_id: string, newOrder: { client_id: string; order: number }[]): Promise<ShiftClients[]> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al reordenar clientes');
    }

    const shiftClients = this.mockShiftClients.filter(sc => sc.shift_id === shift_id);

    // Actualizar el orden
    for (const item of newOrder) {
      const shiftClient = shiftClients.find(sc => sc.client_id === item.client_id);
      if (shiftClient) {
        const index = this.mockShiftClients.findIndex(sc => sc.id === shiftClient.id);
        if (index !== -1) {
          this.mockShiftClients[index] = new ShiftClients(
            shiftClient.client_id,
            item.order,
            shiftClient.id,
            shiftClient.shift_id
          );
        }
      }
    }

    const updated = this.mockShiftClients
      .filter(sc => sc.shift_id === shift_id)
      .sort((a, b) => a.order - b.order);

    console.log(`🔄 Ruta reordenada del shift ${shift_id}`);
    
    return updated;
  }

  /**
   * Utilidad: Agregar cliente al final de la ruta
   */
  async addClientToEnd(shift_id: string, client_id: string): Promise<ShiftClients> {
    const existingClients = await this.getClientsForShift(shift_id);
    const maxOrder = existingClients.length > 0 
      ? Math.max(...existingClients.map(c => c.order))
      : 0;

    return this.create(new ShiftClients(
      client_id,
      maxOrder + 1,
      undefined,
      shift_id
    ));
  }

  /**
   * Utilidad: Reset de datos (para testing)
   */
  resetMockData(): void {
    this.mockShiftClients = [];
    this.shiftClientIdCounter = 1;
    console.log('🔄 Datos de shift-clients reseteados');
  }

  /**
   * Utilidad: Obtener todas las relaciones (sin paginación, para debugging)
   */
  getAllShiftClients(): ShiftClients[] {
    return [...this.mockShiftClients];
  }
}
