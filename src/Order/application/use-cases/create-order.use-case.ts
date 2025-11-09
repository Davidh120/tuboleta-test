import { Order } from '../../domain/entities/order.entity';
import { CreateOrderRequest } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/ports/order.repository';

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(request: CreateOrderRequest): Promise<Order> {
    try {
      if (!request.pointOfSalesId) {
        throw new Error('pointOfSalesId is required');
      }
      if (!request.purchasersInfo?.contactReference) {
        throw new Error('contactReference is required');
      }
      if (!request.simpleProductOperations || request.simpleProductOperations.length === 0) {
        throw new Error('At least one product operation is required');
      }

      const order = await this.orderRepository.createOrUpdateOrder(request);
      if (!order) {
        throw new Error('Order creation failed');
      }
      return order;
    } catch (error) {
      console.error('Error in CreateOrderUseCase:', error);
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
}

