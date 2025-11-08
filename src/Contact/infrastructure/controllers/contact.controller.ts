import { Controller, Get, Query } from '@nestjs/common';
import { GetContactDataUseCase } from '../../application/use-cases/get-contact-data.use-case';
import { Contact } from '../../domain/entities/contact.entity';

@Controller('contacts')
export class ContactController {
  constructor(private readonly getContactDataUseCase: GetContactDataUseCase) {}

  @Get()
  async getContact(@Query('number') contactNumber: number): Promise<Contact> {
    if (!contactNumber) {
      throw new Error('Contact number is required');
    }
    
    try {
      return await this.getContactDataUseCase.execute(contactNumber);
    } catch (error) {
      console.error('Error in ContactController.getContact:', error);
      throw error;
    }
  }
}
