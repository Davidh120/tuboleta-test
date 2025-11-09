import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SoapModule } from 'src/shared/infrastructure/soap/soap.module';
import { SoapOrderRepository } from './infrastructure/adapters/soap-order.repository';
import { OrderRepository } from './domain/ports/order.repository';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { CloseOrderUseCase } from './application/use-cases/close-order.use-case';
import { GetOrderDetailsUseCase } from './application/use-cases/get-order-details.use-case';
import { OrderController } from './infrastructure/controllers/order.controller';
import { soapConfig } from 'src/shared/config/soap.config';
import { ORDER_REPOSITORY } from './tokens';

const orderRepositoryProvider = {
  provide: ORDER_REPOSITORY,
  useClass: SoapOrderRepository,
};

@Module({
  imports: [
    ConfigModule.forFeature(soapConfig),
    SoapModule,
  ],
  controllers: [OrderController],
  providers: [
    orderRepositoryProvider,
    {
      provide: CreateOrderUseCase,
      useFactory: (orderRepository: OrderRepository) => {
        return new CreateOrderUseCase(orderRepository);
      },
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: CloseOrderUseCase,
      useFactory: (orderRepository: OrderRepository) => {
        return new CloseOrderUseCase(orderRepository);
      },
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: GetOrderDetailsUseCase,
      useFactory: (orderRepository: OrderRepository) => {
        return new GetOrderDetailsUseCase(orderRepository);
      },
      inject: [ORDER_REPOSITORY],
    },
  ],
  exports: [CreateOrderUseCase, CloseOrderUseCase, GetOrderDetailsUseCase],
})
export class OrderModule {}

