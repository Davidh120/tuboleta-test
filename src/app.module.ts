import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactsModule } from './Contact/contacts.module';
import { soapConfig } from './shared/config/soap.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [soapConfig],
    }),
    ContactsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
