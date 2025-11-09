import { Contact } from '../../domain/entities/contact.entity';

type SoapContactData = {
  contactData: {
    contactId?: string | number;
    contactNumber?: string | number;
    role?: string;
    state?: string;
    creationDate?: string;
    endValidityDate?: string;
    type?: string;
    guest?: boolean;
  };
  individualContact: {
    login?: string;
    email?: string;
    individualFirstname?: string;
    individualLastname?: string;
    individualGender?: string;
    countryCode?: string;
    phoneNumber1?: string;
    zipCode?: string;
    role?: string;
    active?: boolean;
  };
};

export class SoapContactMapper {
  static toDomain({ contactData, individualContact }: SoapContactData, contactNumber: number): Contact {
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
  }
}
