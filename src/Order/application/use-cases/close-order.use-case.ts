import { Order } from '../../domain/entities/order.entity';
import { CloseOrderRequest } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/ports/order.repository';

export class CloseOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(request: CloseOrderRequest): Promise<Order> {
    try {
      if (!request.orderId) {
        throw new Error('orderId is required');
      }
      if (!request.purchaserInfo?.contactReference) {
        throw new Error('contactReference is required');
      }

      const order = await this.orderRepository.closeOrder(request);
      if (!order) {
        throw new Error('Order closure failed');
      }
      return order;
    } catch (error) {
      console.error('Error in CloseOrderUseCase:', error);
      throw new Error(`Failed to close order: ${error.message}`);
    }
  }
}

