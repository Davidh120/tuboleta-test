import { Inject, Injectable } from '@nestjs/common';
import { Catalog } from '../../domain/entities/catalog.entity';
import { CatalogRepository } from '../../domain/ports/catalog.repository';
import { SoapClientService } from 'src/shared/infrastructure/soap/soap-client.service';
import type { ConfigType } from '@nestjs/config';
import { soapConfig } from 'src/shared/config/soap.config';
import { SoapCatalogMapper } from '../mappers/soap-catalog.mapper';

@Injectable()
export class SoapCatalogRepository implements CatalogRepository {
  private client: any;

  constructor(
    private readonly soapClientService: SoapClientService,
    @Inject(soapConfig.KEY)
    private readonly soapConf: ConfigType<typeof soapConfig>,
  ) {}

  private async ensureClient() {
  if (!this.client) {
    if (!this.soapConf.wsdlUrl || !this.soapConf.username || !this.soapConf.password) {
      throw new Error('SOAP configuration is missing. Please check your environment variables.');
    }

    this.client = await this.soapClientService.createClient({
      wsdlUrl: `${this.soapConf.wsdlUrl}/tnseb/external-remoting/com.secutix.service.realtime.catalog.v1_33.CatalogService.webservice?wsdl`,
      username: this.soapConf.username,
      password: this.soapConf.password,
      mustUnderstand: false,
      wsdlOptions: {
        wsdl_headers: {
          Authorization: 'Basic ' + Buffer.from(`${this.soapConf.username}:${this.soapConf.password}`).toString('base64'),
        },
      },
    });
  }
  return this.client;
}

  async getCatalogDetailed(): Promise<Catalog> {
    try {
      const client = await this.ensureClient();
      const response = await client.call('getCatalogDetailed', {});
      
      console.log('SOAP Catalog Response received');
      
      if (!response || !response.result) {
        throw new Error('Invalid SOAP response structure: Missing result');
      }
      
      return SoapCatalogMapper.toDomain(response.result);
    } catch (error) {
      console.error('Error in SoapCatalogRepository.getCatalogDetailed:', error);
      throw new Error(`Failed to fetch catalog from SOAP service: ${error.message}`);
    }
  }
}

