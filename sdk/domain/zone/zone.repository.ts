import { Pagination } from "@/sdk/utils/type/pagination";
import { Zone } from "./zone.entity";

/**
 * Aplicar DRY
 */

// interface Repository<T> {
//   create: (data: T) => Promise<T>
//   find_all: (data: Pagination) => Promise<T[]>
//   find_by_id: (id: string) => Promise<T>
//   update: (id: string, data: T) => Promise<T>
//   delete: (id: string) => Promise<void>
// }

// export interface ZoneRepository extends Repository<Zone> {};
export interface ZoneRepository {
  get_zones: (data: Pagination) => Promise<Zone[]>;
};