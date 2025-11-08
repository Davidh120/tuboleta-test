import { Contact } from '../entities/contact.entity';

export interface ContactRepository {
  getContactById(contactNumber: number): Promise<Contact>;
}
