import { Module, Global } from '@nestjs/common';
import { SoapClientService } from './soap-client.service';

@Global()
@Module({
  providers: [SoapClientService],
  exports: [SoapClientService],
})
export class SoapModule {}