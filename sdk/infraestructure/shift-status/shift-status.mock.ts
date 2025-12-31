import { ShiftStatusRepository } from "@/sdk/domain/shift-status/shift-status-repository";
import { ShiftStatusEntity } from "@/sdk/domain/shift-status/shift-status.entity";
import { Pagination } from "@/sdk/utils/type/pagination";
/**
 * Mock ShiftStatus Adapter - Simula el historial de cambios de estado de shifts
 */
export class ShiftStatusMockAdapter implements ShiftStatusRepository {
  private readonly ERROR_RATE = 0.08; // 8% de probabilidad de error
  private readonly MIN_DELAY = 200; // ms
  private readonly MAX_DELAY = 800; // ms
  
  // Base de datos en memoria - Historial de cambios de estado
  private mockShiftStatuses: ShiftStatusEntity[] = [];
  private statusIdCounter = 1;

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
    return `shift-status-${Date.now()}-${this.statusIdCounter++}`;
  }

  /**
   * Create - Registrar un cambio de estado
   */
  async create(data: ShiftStatusEntity): Promise<ShiftStatusEntity> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al registrar cambio de estado');
    }

    const newStatus = new ShiftStatusEntity(
      data.action,
      data.shift_id,
      this.generateId()
    );

    this.mockShiftStatuses.push(newStatus);

    console.log(`📝 Estado registrado: ${newStatus.action} para shift ${newStatus.shift_id}`);
    
    return newStatus;
  }

  /**
   * Find All - Obtener historial de cambios de estado
   */
  async find_all(props: Pagination): Promise<ShiftStatusEntity[]> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al obtener historial de estados');
    }

    const { page = 1 } = props;
    const page_size = 10;
    
    const from = (page - 1) * page_size;
    const to = from + page_size;

    console.log(`📋 Obteniendo historial - Página ${page}, Total: ${this.mockShiftStatuses.length}`);
    
    return this.mockShiftStatuses.slice(from, to);
  }

  /**
   * Find By Id - Obtener un cambio de estado específico
   */
  async find_by_id(id: string): Promise<ShiftStatusEntity> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al obtener estado');
    }

    const status = this.mockShiftStatuses.find(s => s.id === id);

    if (!status) {
      throw new Error(`Estado con ID ${id} no encontrado`);
    }

    console.log('🔍 Estado encontrado:', status.id);
    return status;
  }

  /**
   * Update - En realidad crea un nuevo registro de estado
   * (El historial no se edita, se agregan nuevos registros)
   */
  async update(shift_id: string, data: Partial<ShiftStatusEntity>): Promise<ShiftStatusEntity> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al actualizar estado');
    }

    if (!data.action) {
      throw new Error('El action es requerido para actualizar el estado');
    }

    // En lugar de update, creamos un nuevo registro
    const newStatus = new ShiftStatusEntity(
      data.action,
      shift_id
    );

    console.log(shift_id);

    this.mockShiftStatuses.push(newStatus);

    console.log(`✏️ Nuevo estado: ${data.action} para shift ${shift_id}`);
    
    return newStatus;
  }

  /**
   * Delete - Eliminar un registro de estado
   */
  async delete(id: string): Promise<void> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al eliminar estado');
    }

    const index = this.mockShiftStatuses.findIndex(s => s.id === id);

    if (index === -1) {
      throw new Error(`Estado con ID ${id} no encontrado`);
    }

    this.mockShiftStatuses.splice(index, 1);
    console.log('🗑️ Estado eliminado:', id);
  }

  /**
   * Utilidad: Obtener historial de un shift específico
   */
  async getShiftHistory(shift_id: string): Promise<ShiftStatusEntity[]> {
    await this.simulateNetworkDelay();

    const history = this.mockShiftStatuses.filter(s => s.shift_id === shift_id);
    
    console.log(`📜 Historial del shift ${shift_id}: ${history.length} cambios`);
    
    return history;
  }

  /**
   * Utilidad: Obtener último estado de un shift
   */
  async getLastStatus(shift_id: string): Promise<ShiftStatusEntity | null> {
    const history = this.mockShiftStatuses.filter(s => s.shift_id === shift_id);
    
    if (history.length === 0) {
      return null;
    }

    return history[history.length - 1];
  }

  /**
   * Utilidad: Reset de datos (para testing)
   */
  resetMockData(): void {
    this.mockShiftStatuses = [];
    this.statusIdCounter = 1;
    console.log('🔄 Datos de shift statuses reseteados');
  }

  /**
   * Utilidad: Obtener todos los estados (sin paginación, para debugging)
   */
  getAllStatuses(): ShiftStatusEntity[] {
    return [...this.mockShiftStatuses];
  }
}
