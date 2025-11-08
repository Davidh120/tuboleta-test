import { Inject, Injectable } from '@nestjs/common';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepository } from '../../domain/ports/contact.repository';
import { SoapClientService } from 'src/shared/infrastructure/soap/soap-client.service';
import type { ConfigType } from '@nestjs/config';
import { soapConfig } from 'src/shared/config/soap.config';
import { SoapContactMapper } from '../mappers/soap-contact.mapper';

@Injectable()
export class SoapContactRepository implements ContactRepository {
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
        wsdlUrl: this.soapConf.wsdlUrl + '.contact.v2_21.ContactInformationPublicService.webservice?wsdl',
        username: this.soapConf.username,
        password: this.soapConf.password,
      });
    }
    return this.client;
  }

  async getContactById(contactNumber: number): Promise<Contact> {
    try {
      const client = await this.ensureClient();
      const response = await client.call('getContactData', { contactNumber });
      
      console.log('SOAP Response:', JSON.stringify(response, null, 2));
      
      if (!response || !response.result || !response.result.ContactDataResult) {
        throw new Error('Invalid SOAP response structure: Missing ContactDataResult');
      }
      
      const contactData = response.result.ContactDataResult;
      const individualContact = contactData.individualContact;
      
      if (!individualContact) {
        throw new Error('No individual contact data found in response');
      }
      
       return SoapContactMapper.toDomain({ contactData, individualContact }, contactNumber);
    } catch (error) {
      console.error('Error in SoapContactRepository.getContactById:', error);
      throw new Error(`Failed to fetch contact from SOAP service: ${error.message}`);
    }
  }
}
