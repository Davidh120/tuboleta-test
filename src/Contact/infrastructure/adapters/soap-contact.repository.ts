import { Inject, Injectable } from '@nestjs/common';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepository } from '../../domain/ports/contact.repository';
import { SoapClientService } from 'src/shared/infrastructure/soap/soap-client.service';
import type { ConfigType } from '@nestjs/config';
import { soapConfig } from 'src/shared/config/soap.config';

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
        wsdlUrl: this.soapConf.wsdlUrl,
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
      
      return new Contact(
        Number(contactData.contactId) || 0,
        Number(contactData.contactNumber) || contactNumber,
        individualContact.login || '',
        individualContact.email || '',
        individualContact.individualFirstname || '',
        individualContact.individualLastname || '',
        individualContact.individualGender?.toLowerCase() || 'other',
        individualContact.countryCode || '',
        individualContact.phoneNumber1 || '',
        individualContact.zipCode || '',
        contactData.role || individualContact.role || '',
        contactData.state || '',
        contactData.creationDate || new Date().toISOString(),
        contactData.endValidityDate || '',
        contactData.type || 'INDIVIDUAL',
        contactData.guest || false,
        individualContact.active || false
      );
    } catch (error) {
      console.error('Error in SoapContactRepository.getContactById:', error);
      throw new Error(`Failed to fetch contact from SOAP service: ${error.message}`);
    }
  }
}
