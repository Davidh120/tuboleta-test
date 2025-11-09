import { POSConfig } from '../entities/pos-config.entity';

export interface POSRepository {
  getPOSConfig(): Promise<POSConfig>;
}
