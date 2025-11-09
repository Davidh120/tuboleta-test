import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { CreateOrderRequest, CloseOrderRequest, GetOrderDetailsRequest } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/ports/order.repository';
import { SoapClientService } from 'src/shared/infrastructure/soap/soap-client.service';
import type { ConfigType } from '@nestjs/config';
import { soapConfig } from 'src/shared/config/soap.config';
import { SoapOrderMapper } from '../mappers/soap-order.mapper';

@Injectable()
export class SoapOrderRepository implements OrderRepository {
  private createClient: any;
  private orderClient: any;

  constructor(
    private readonly soapClientService: SoapClientService,
    @Inject(soapConfig.KEY)
    private readonly soapConf: ConfigType<typeof soapConfig>,
  ) {}

  private async ensureCreateClient() {
    if (!this.createClient) {
      if (!this.soapConf.wsdlUrl || !this.soapConf.username || !this.soapConf.password) {
        throw new Error('SOAP configuration is missing. Please check your environment variables.');
      }
      
      this.createClient = await this.soapClientService.createClient({
        wsdlUrl: `${this.soapConf.wsdlUrl}/tnseb/external-remoting/com.secutix.service.realtime.externalorder.v1_33.ExternalOrderFacade.webservice?wsdl`,
        username: this.soapConf.username,
        password: this.soapConf.password,
        mustUnderstand: false,
        wsdlOptions: {
          wsdl_headers: {
            Authorization: 'Basic ' + Buffer.from(`${this.soapConf.username}:${this.soapConf.password}`).toString('base64'),
          },
        },
      });
    }
    return this.createClient;
  }

  private async ensureClient() {
    if (!this.soapConf.wsdlUrl || !this.soapConf.username || !this.soapConf.password) {
        throw new Error('SOAP configuration is missing. Please check your environment variables.');
      }
      
      this.orderClient = await this.soapClientService.createClient({
        wsdlUrl: `${this.soapConf.wsdlUrl}/tnseb/external-remoting/com.secutix.service.realtime.externalorder.v1_33.ExternalOrderService.webservice?wsdl`,
        username: this.soapConf.username,
        password: this.soapConf.password,
        mustUnderstand: false,
        wsdlOptions: {
          wsdl_headers: {
            Authorization: 'Basic ' + Buffer.from(`${this.soapConf.username}:${this.soapConf.password}`).toString('base64'),
          },
        },
      });
    return this.orderClient;
  }

  async createOrUpdateOrder(request: CreateOrderRequest): Promise<Order> {
    try {
      const client = await this.ensureCreateClient();
      
      const soapRequest = {
        pointOfSalesId: request.pointOfSalesId,
        orderType: request.orderType,
        purchasersInfo: {
          contactReference: request.purchasersInfo.contactReference,
        },
        simpleProductOperations: request.simpleProductOperations.map(op => ({
          audienceSubCategoryId: op.audienceSubCategoryId,
          quantity: op.quantity,
          itemId: op.itemId,
        })),
      };
      
      const response = await client.call('createOrUpdateOrder', soapRequest);
      
      if (!response || !response.result) {
        throw new Error('Invalid SOAP response structure: Missing result');
      }
      
      return SoapOrderMapper.toDomainFromCreate(response.result);
    } catch (error) {
      console.error('Error in SoapOrderRepository.createOrUpdateOrder:', error);
      throw new Error(`Failed to create order from SOAP service: ${error.message}`);
    }
  }

  async closeOrder(request: CloseOrderRequest): Promise<Order> {
    try {
      const client = await this.ensureClient();
      
      const soapRequest = {
        purchaserInfo: {
          contactReference: request.purchaserInfo.contactReference,
        },
        orderId: request.orderId,
        generateBarCodes: request.generateBarCodes,
        maxWaitingTime: request.maxWaitingTime,
        orderType: request.orderType,
      };
      
      const response = await client.call('closeOrder', soapRequest);
      
      if (!response || !response.result) {
        throw new Error('Invalid SOAP response structure: Missing result');
      }
      
      return SoapOrderMapper.toDomainFromClose(response.result);
    } catch (error) {
      console.error('Error in SoapOrderRepository.closeOrder:', error);
      throw new Error(`Failed to close order from SOAP service: ${error.message}`);
    }
  }

  async getOrderDetails(request: GetOrderDetailsRequest): Promise<Order> {
    try {
      const client = await this.ensureClient();
      
      const soapRequest = {
        orderId: request.orderId,
      };
      
      const response = await client.call('getOrderDetails', soapRequest);
      
      if (!response || !response.result) {
        throw new Error('Invalid SOAP response structure: Missing result');
      }
      
      return SoapOrderMapper.toDomainFromGetDetails(response.result);
    } catch (error) {
      console.error('Error in SoapOrderRepository.getOrderDetails:', error);
      throw new Error(`Failed to get order details from SOAP service: ${error.message}`);
    }
  }
}

