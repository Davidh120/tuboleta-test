import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Injectable } from 'src/shared/dependency-injection/injectable';
import * as soap from 'soap';
import * as WSSecurity from 'wssecurity';
import { SoapClient, SoapClientOptions, SoapClientResponse } from './soap.types';

type SoapClientType = {
  [key: string]: any;
  setSecurity: (security: any) => void;
};

@Injectable()
export class SoapClientService implements OnModuleInit, OnModuleDestroy {
  private client: SoapClientType | null = null;
  private wsdlUrl: string | null = null;
  private wsdlOptions: any = {};
  private security: any = null;

  async createClient(options: SoapClientOptions): Promise<SoapClient> {
    this.wsdlUrl = options.wsdlUrl;
    this.wsdlOptions = options.wsdlOptions || {};
    
    this.security = new WSSecurity(options.username, options.password, {
      hasTimeStamp: false,
      hasTokenCreated: true,
      hasTimeStampExpiry: false,
      mustUnderstand: true,
      actor: 'http://schemas.xmlsoap.org/soap/actor/next',
    });

    this.client = (await soap.createClientAsync(this.wsdlUrl, this.wsdlOptions)) as SoapClientType;
    
    if (this.client) {
      this.client.setSecurity(this.security);
    } else {
      throw new Error('Failed to create SOAP client');
    }
    
    return {
      call: async <T = any>(method: string, args: any): Promise<SoapClientResponse<T>> => {
        if (!this.client) {
          throw new Error('SOAP client not initialized');
        }
        
        const methodName = `${method}Async`;
        if (typeof this.client[methodName] !== 'function') {
          throw new Error(`SOAP method '${method}' not found`);
        }
        
        try {
          const [result, rawResponse, soapHeader] = await this.client[methodName](args);
          return {
            result,
            response: rawResponse,
            rawResponse: rawResponse ? rawResponse.toString() : '',
            soapHeader,
          };
        } catch (error) {
          console.error('SOAP call failed:', error);
          throw error;
        }
      },
      setSecurity: (security: any) => {
        this.security = security;
        if (this.client) {
          this.client.setSecurity(security);
        }
      },
      getClient: () => this.client,
    };
  }

  async onModuleInit() {
    if (this.wsdlUrl) {
      await this.createClient({
        wsdlUrl: this.wsdlUrl,
        username: '',
        password: '',
        ...this.wsdlOptions,
      });
    }
  }

  async onModuleDestroy() {
    this.client = null;
  }
}