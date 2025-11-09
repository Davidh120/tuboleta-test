import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SoapModule } from 'src/shared/infrastructure/soap/soap.module';
import { SoapPOSRepository } from './infrastructure/adapters/soap-pos.repository';
import { POSRepository } from './domain/ports/pos.repository';
import { GetPOSConfigUseCase } from './application/use-cases/get-pos-config.use-case';
import { POSController } from './infrastructure/controllers/pos.controller';
import { soapConfig } from 'src/shared/config/soap.config';
import { POS_REPOSITORY } from './tokens';

const posRepositoryProvider = {
  provide: POS_REPOSITORY,
  useClass: SoapPOSRepository,
};

@Module({
  imports: [
    ConfigModule.forFeature(soapConfig),
    SoapModule,
  ],
  controllers: [POSController],
  providers: [
    posRepositoryProvider,
    {
      provide: GetPOSConfigUseCase,
      useFactory: (posRepository: POSRepository) => {
        return new GetPOSConfigUseCase(posRepository);
      },
      inject: [POS_REPOSITORY],
    },
  ],
  exports: [GetPOSConfigUseCase],
})
export class POSModule {}

