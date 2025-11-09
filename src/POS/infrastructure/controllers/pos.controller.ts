import { Controller, Get } from '@nestjs/common';
import { GetPOSConfigUseCase } from '../../application/use-cases/get-pos-config.use-case';
import { POSConfig } from '../../domain/entities/pos-config.entity';

@Controller('pos')
export class POSController {
  constructor(private readonly getPOSConfigUseCase: GetPOSConfigUseCase) {}

  @Get()
  async getPOSConfig(): Promise<POSConfig> {
    try {
      return await this.getPOSConfigUseCase.execute();
    } catch (error) {
      console.error('Error in POSController.getPOSConfig:', error);
      throw error;
    }
  }
}

