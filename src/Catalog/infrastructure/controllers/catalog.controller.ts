import { Controller, Get } from '@nestjs/common';
import { GetCatalogDetailedUseCase } from '../../application/use-cases/get-catalog-detailed.use-case';
import { Catalog } from '../../domain/entities/catalog.entity';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly getCatalogDetailedUseCase: GetCatalogDetailedUseCase) {}

  @Get()
  async getCatalog(): Promise<Catalog> {
    try {
      return await this.getCatalogDetailedUseCase.execute();
    } catch (error) {
      console.error('Error in CatalogController.getCatalog:', error);
      throw error;
    }
  }
}

