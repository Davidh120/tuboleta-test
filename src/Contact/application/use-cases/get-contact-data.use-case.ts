import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepository } from '../../domain/ports/contact.repository';

export class GetContactDataUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(contactNumber: number): Promise<Contact> {
    try {
      const contact = await this.contactRepository.getContactById(contactNumber);
      if (!contact) {
        throw new Error('Contact not found');
      }
      return contact;
    } catch (error) {
      console.error('Error in GetContactDataUseCase:', error);
      throw new Error('Failed to retrieve contact data');
    }
  }
}
