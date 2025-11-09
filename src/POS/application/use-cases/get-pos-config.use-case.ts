import { POSConfig } from '../../domain/entities/pos-config.entity';
import { POSRepository } from '../../domain/ports/pos.repository';

export class GetPOSConfigUseCase {
  constructor(private readonly posRepository: POSRepository) {}

  async execute(): Promise<POSConfig> {
    try {
      const posConfig = await this.posRepository.getPOSConfig();
      if (!posConfig) {
        throw new Error('POS configuration not found');
      }
      return posConfig;
    } catch (error) {
      console.error('Error in GetPOSConfigUseCase:', error);
      throw new Error(`Failed to retrieve POS configuration: ${error.message}`);
    }
  }
}

