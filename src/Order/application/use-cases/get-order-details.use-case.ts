import { Order } from '../../domain/entities/order.entity';
import { GetOrderDetailsRequest } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/ports/order.repository';

export class GetOrderDetailsUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(request: GetOrderDetailsRequest): Promise<Order> {
    try {
      if (!request.orderId) {
        throw new Error('orderId is required');
      }

      const order = await this.orderRepository.getOrderDetails(request);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      console.error('Error in GetOrderDetailsUseCase:', error);
      throw new Error(`Failed to get order details: ${error.message}`);
    }
  }
}

