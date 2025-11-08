import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SoapModule } from 'src/shared/infrastructure/soap/soap.module';
import { SoapContactRepository } from './infrastructure/adapters/soap-contact.repository';
import { ContactRepository } from './domain/ports/contact.repository';
import { GetContactDataUseCase } from './application/use-cases/get-contact-data.use-case';
import { ContactController } from './infrastructure/controllers/contact.controller';
import { soapConfig } from 'src/shared/config/soap.config';
import { CONTACT_REPOSITORY } from './tokens';

const contactRepositoryProvider = {
  provide: CONTACT_REPOSITORY,
  useClass: SoapContactRepository,
};

@Module({
  imports: [
    ConfigModule.forFeature(soapConfig),
    SoapModule,
  ],
  controllers: [ContactController],
  providers: [
    contactRepositoryProvider,
    {
      provide: GetContactDataUseCase,
      useFactory: (contactRepository: ContactRepository) => {
        return new GetContactDataUseCase(contactRepository);
      },
      inject: [CONTACT_REPOSITORY],
    },
  ],
  exports: [GetContactDataUseCase],
})
export class ContactsModule {}
