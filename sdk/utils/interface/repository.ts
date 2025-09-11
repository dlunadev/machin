import { Pagination } from "../type/pagination"

export interface Repository<T> {
  create: (data: T) => Promise<T>
  find_all: (data: Pagination) => Promise<T[]>
  find_by_id: (id: string) => Promise<T>
  update: (id: string, data: Partial<T>) => Promise<T>
  delete: (id: string) => Promise<void>
}