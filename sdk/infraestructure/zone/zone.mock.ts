import { Zone } from "@/sdk/domain/zone/zone.entity";
import { ZoneRepository } from "@/sdk/domain/zone/zone.repository";
import { Pagination } from "@/sdk/utils/type/pagination";

/**
 * Mock Zone Adapter - Simula operaciones de zonas con delays y errores aleatorios
 */
export class ZoneMockAdapter implements ZoneRepository {
  private readonly ERROR_RATE = 0.08; // 8% de probabilidad de error
  private readonly MIN_DELAY = 200; // ms
  private readonly MAX_DELAY = 800; // ms
  
  // Base de datos en memoria - Zonas de Buenos Aires
  private mockZones: Zone[] = [
    new Zone("zone-001", "Zona Norte"),
    new Zone("zone-002", "Zona Sur"),
    new Zone("zone-003", "Zona Oeste"),
    new Zone("zone-004", "Zona Centro"),
    new Zone("zone-005", "Zona Este"),
    new Zone("zone-006", "Palermo y alrededores"),
    new Zone("zone-007", "Belgrano y Núñez"),
    new Zone("zone-008", "Caballito y Flores"),
    new Zone("zone-009", "Villa Crespo y Almagro"),
    new Zone("zone-010", "Recoleta y Barrio Norte"),
    new Zone("zone-011", "San Telmo y La Boca"),
    new Zone("zone-012", "Puerto Madero"),
    new Zone("zone-013", "Colegiales y Villa Ortúzar"),
    new Zone("zone-014", "Parque Chacabuco y Mataderos"),
    new Zone("zone-015", "Saavedra y Villa Urquiza"),
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
   * Get Zones - Obtener zonas con paginación y búsqueda
   */
  async get_zones({ page = 1, search_term }: Pagination): Promise<Zone[]> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al obtener zonas');
    }

    const page_size = 10;
    let filteredZones = [...this.mockZones];

    // Filtrar por búsqueda
    if (search_term && search_term.trim().length > 1) {
      const term = search_term.toLowerCase();
      filteredZones = filteredZones.filter(z => 
        z.name.toLowerCase().includes(term)
      );
    }

    // Paginación
    const from = (page - 1) * page_size;
    const to = from + page_size;

    console.log(`📍 Obteniendo zonas - Página ${page}, Total: ${filteredZones.length}`);
    
    return filteredZones.slice(from, to);
  }

  /**
   * Find By Id - Obtener una zona por ID
   */
  async find_by_id(id: string): Promise<Zone> {
    await this.simulateNetworkDelay();

    if (this.shouldSimulateError()) {
      throw new Error('Error al obtener zona');
    }

    const zone = this.mockZones.find(z => z.id === id);

    if (!zone) {
      throw new Error(`Zona con ID ${id} no encontrada`);
    }

    console.log('🔍 Zona encontrada:', zone.name);
    return zone;
  }

  /**
   * Utilidad: Reset de datos (para testing)
   */
  resetMockData(): void {
    this.mockZones = [...this.getInitialMockData()];
    console.log('🔄 Datos de zonas reseteados');
  }

  /**
   * Utilidad: Obtener datos iniciales
   */
  private getInitialMockData(): Zone[] {
    return [
      new Zone("zone-001", "Zona Norte"),
      new Zone("zone-002", "Zona Sur"),
      new Zone("zone-003", "Zona Oeste"),
      new Zone("zone-004", "Zona Centro"),
      new Zone("zone-005", "Zona Este"),
      new Zone("zone-006", "Palermo y alrededores"),
      new Zone("zone-007", "Belgrano y Núñez"),
      new Zone("zone-008", "Caballito y Flores"),
      new Zone("zone-009", "Villa Crespo y Almagro"),
      new Zone("zone-010", "Recoleta y Barrio Norte"),
      new Zone("zone-011", "San Telmo y La Boca"),
      new Zone("zone-012", "Puerto Madero"),
      new Zone("zone-013", "Colegiales y Villa Ortúzar"),
      new Zone("zone-014", "Parque Chacabuco y Mataderos"),
      new Zone("zone-015", "Saavedra y Villa Urquiza"),
    ];
  }

  /**
   * Utilidad: Agregar zona (para testing/desarrollo)
   */
  async addZone(zone: Zone): Promise<Zone> {
    await this.simulateNetworkDelay();
    
    if (this.shouldSimulateError()) {
      throw new Error('Error al agregar zona');
    }

    this.mockZones.push(zone);
    console.log('✅ Zona agregada:', zone.name);
    return zone;
  }
}
