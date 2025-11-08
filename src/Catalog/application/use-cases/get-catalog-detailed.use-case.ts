import { Catalog } from '../../domain/entities/catalog.entity';
import { CatalogRepository } from '../../domain/ports/catalog.repository';

export class GetCatalogDetailedUseCase {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async execute(): Promise<Catalog> {
    try {
      const catalog = await this.catalogRepository.getCatalogDetailed();
      if (!catalog) {
        throw new Error('Catalog not found');
      }
      return catalog;
    } catch (error) {
      console.error('Error in GetCatalogDetailedUseCase:', error);
      throw new Error(`Failed to retrieve catalog: ${error.message}`);
    }
  }
}

