import { Shift } from "@/sdk/domain/shift/shift.entity";
import { ShiftRepository } from "@/sdk/domain/shift/shift.repository";
import { ShiftStatus } from "@/sdk/utils/enum/shift-status";
import { Pagination } from "@/sdk/utils/type/pagination";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Mock Shift Adapter - Simula operaciones de turnos con delays y errores aleatorios
 */
export class ShiftMockAdapter implements ShiftRepository {
  private readonly ERROR_RATE = 0.08; // 8% de probabilidad de error
  private readonly MIN_DELAY = 300; // ms
  private readonly MAX_DELAY = 1000; // ms
  
  // Base de datos en memoria
  private mockShifts: Shift[] = [];
  private shiftIdCounter = 1;

  constructor() {
    // Inicializar con algunos shifts de ejemplo
    this.mockShifts = [
      new Shift(
        "zone-001",
        "user-001",
        ShiftStatus.FINISHED,
        "shift-001",
        8.5,
        "route-data-001",
        45.3,
        new Date(Date.now() - 86400000) // Ayer
      ),
      new Shift(
        "zone-002",
        "user-001",
        ShiftStatus.FINISHED,
        "shift-002",
        7.2,
        "route-data-002",
        38.7,
        new Date(Date.now() - 172800000) // Hace 2 días
      ),
    ];
  }

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
    return `shift-${Date.now()}-${this.shiftIdCounter++}`;
  }

  /**
   * Create - Crear un nuevo shift
   */
  async create(data: Shift): Promise<Shift> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error de red al crear shift');
    }

    // Validar que no haya un shift activo
    const activeShift = this.mockShifts.find(
      s => s.seller_id === data.seller_id && s.status !== ShiftStatus.FINISHED
    );

    if (activeShift) {
      throw new Error('Ya tenés un shift activo');
    }

    const newShift = new Shift(
      data.zone_id,
      data.seller_id,
      data.status || ShiftStatus.STARTED,
      this.generateId(),
    );

    this.mockShifts.push(newShift);

    // Guardar en AsyncStorage como hace el adapter real
    await AsyncStorage.setItem('shift_id', JSON.stringify(newShift.id));

    return newShift;
  }

  /**
   * Find All - Obtener todos los shifts
   */
  async find_all(props: Pagination): Promise<Shift[]> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al obtener shifts');
    }

    const { page = 1 } = props;
    const page_size = 10;
    
    const from = (page - 1) * page_size;
    const to = from + page_size;

    console.log(`📋 Obteniendo shifts - Página ${page}, Total: ${this.mockShifts.length}`);
    
    return this.mockShifts.slice(from, to);
  }

  /**
   * Find By Id - Obtener un shift por ID
   */
  async find_by_id(id: string): Promise<Shift> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al obtener shift');
    }

    const shift = this.mockShifts.find(s => s.id === id);

    if (!shift) {
      throw new Error(`Shift con ID ${id} no encontrado`);
    }

    console.log('🔍 Shift encontrado:', shift.id);
    return shift;
  }

  /**
   * Update - Actualizar un shift (generalmente el status)
   */
  async update(id: string, data: Partial<Shift>): Promise<Shift> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al actualizar shift');
    }

    const index = this.mockShifts.findIndex(s => s.id === id);

    if (index === -1) {
      throw new Error(`Shift con ID ${id} no encontrado`);
    }

    // Actualizar el shift
    const currentShift = this.mockShifts[index];
    const updatedShift = new Shift(
      currentShift.zone_id,
      currentShift.seller_id,
      data.status ?? currentShift.status,
      currentShift.id,
      data.active_hours ?? currentShift.active_hours,
      data.route ?? currentShift.route,
      data.distance ?? currentShift.distance,
      currentShift.created_at
    );

    this.mockShifts[index] = updatedShift;

    console.log('✏️ Shift actualizado:', updatedShift.id, '- Status:', updatedShift.status);

    return updatedShift;
  }

  /**
   * Delete - Eliminar un shift
   */
  async delete(id: string): Promise<void> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al eliminar shift');
    }

    const index = this.mockShifts.findIndex(s => s.id === id);

    if (index === -1) {
      throw new Error(`Shift con ID ${id} no encontrado`);
    }

    this.mockShifts.splice(index, 1);
    console.log('🗑️ Shift eliminado:', id);
  }

  /**
   * Get Active Shifts - Obtener el shift activo de un usuario
   */
  async get_active_shifts(user_id: string): Promise<Shift | null> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al obtener shift activo');
    }

    const activeShift = this.mockShifts.find(
      s => s.seller_id === user_id && s.status !== ShiftStatus.FINISHED
    );

    if (!activeShift) {
      console.log('ℹ️ No hay shift activo para el usuario:', user_id);

      return null;
    }

    console.log('🔍 Shift activo encontrado:', activeShift.id, '- Status:', activeShift.status);
    return activeShift;
  }

  /**
   * Utilidad: Reset de datos (para testing)
   */
  resetMockData(): void {
    this.mockShifts = [];
    this.shiftIdCounter = 1;
    console.log('🔄 Datos de shifts reseteados');
  }

  /**
   * Utilidad: Obtener todos los shifts (sin paginación, para debugging)
   */
  getAllShifts(): Shift[] {
    return [...this.mockShifts];
  }
}
