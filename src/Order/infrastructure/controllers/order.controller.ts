import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { CloseOrderUseCase } from '../../application/use-cases/close-order.use-case';
import { GetOrderDetailsUseCase } from '../../application/use-cases/get-order-details.use-case';
import { 
  Order, 
  CreateOrderRequest, 
  CloseOrderRequest, 
  GetOrderDetailsRequest, 
  PurchasersInfo, 
  SimpleProductOperation 
} from '../../domain/entities/order.entity';
import { CreateOrderRequestDto, CloseOrderRequestDto } from '../dtos';

@Controller('order')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly closeOrderUseCase: CloseOrderUseCase,
    private readonly getOrderDetailsUseCase: GetOrderDetailsUseCase,
  ) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(@Body() request: CreateOrderRequestDto): Promise<Order> {
    try {
      const createOrderRequest = new CreateOrderRequest(
        request.pointOfSalesId,
        request.orderType,
        new PurchasersInfo(request.purchasersInfo.contactReference),
        request.simpleProductOperations.map(op => 
          new SimpleProductOperation(
            op.audienceSubCategoryId,
            op.quantity,
            op.itemId
          )
        )
      );
      
      return await this.createOrderUseCase.execute(createOrderRequest);
    } catch (error) {
      console.error('Error in OrderController.createOrder:', error);
      throw error;
    }
  }

  @Post('close')
  @UsePipes(new ValidationPipe({ transform: true }))
  async closeOrder(@Body() request: CloseOrderRequestDto): Promise<Order> {
    try {
      const closeOrderRequest = new CloseOrderRequest(
        new PurchasersInfo(request.purchaserInfo.contactReference),
        request.orderId,
        request.generateBarCodes,
        request.maxWaitingTime,
        request.orderType
      );
      
      return await this.closeOrderUseCase.execute(closeOrderRequest);
    } catch (error) {
      console.error('Error in OrderController.closeOrder:', error);
      throw error;
    }
  }

  @Get(':id')
  async getOrderDetails(@Param('id') orderId: string): Promise<Order> {
    try {
      const request = new GetOrderDetailsRequest(orderId);
      return await this.getOrderDetailsUseCase.execute(request);
    } catch (error) {
      console.error('Error in OrderController.getOrderDetails:', error);
      throw error;
    }
  }
}

