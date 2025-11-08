import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SoapModule } from 'src/shared/infrastructure/soap/soap.module';
import { SoapCatalogRepository } from './infrastructure/adapters/soap-catalog.repository';
import { CatalogRepository } from './domain/ports/catalog.repository';
import { GetCatalogDetailedUseCase } from './application/use-cases/get-catalog-detailed.use-case';
import { CatalogController } from './infrastructure/controllers/catalog.controller';
import { soapConfig } from 'src/shared/config/soap.config';
import { CATALOG_REPOSITORY } from './tokens';

const catalogRepositoryProvider = {
  provide: CATALOG_REPOSITORY,
  useClass: SoapCatalogRepository,
};

@Module({
  imports: [
    ConfigModule.forFeature(soapConfig),
    SoapModule,
  ],
  controllers: [CatalogController],
  providers: [
    catalogRepositoryProvider,
    {
      provide: GetCatalogDetailedUseCase,
      useFactory: (catalogRepository: CatalogRepository) => {
        return new GetCatalogDetailedUseCase(catalogRepository);
      },
      inject: [CATALOG_REPOSITORY],
    },
  ],
  exports: [GetCatalogDetailedUseCase],
})
export class CatalogModule {}

