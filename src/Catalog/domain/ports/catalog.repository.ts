import { Catalog } from '../entities/catalog.entity';

export interface CatalogRepository {
  getCatalogDetailed(): Promise<Catalog>;
}

