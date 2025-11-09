import { Order } from '../entities/order.entity';
import { CreateOrderRequest, CloseOrderRequest, GetOrderDetailsRequest } from '../entities/order.entity';

export interface OrderRepository {
  createOrUpdateOrder(request: CreateOrderRequest): Promise<Order>;
  closeOrder(request: CloseOrderRequest): Promise<Order>;
  getOrderDetails(request: GetOrderDetailsRequest): Promise<Order>;
}

