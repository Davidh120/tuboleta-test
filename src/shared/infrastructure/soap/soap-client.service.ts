import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as soap from 'soap';
import { SoapClient, SoapClientOptions, SoapClientResponse } from './soap.types';

const { WSSecurity } = soap;

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
    try {
      this.wsdlUrl = options.wsdlUrl;
      this.wsdlOptions = options.wsdlOptions || {};

      this.security = new WSSecurity(options.username, options.password, {
        hasTimeStamp: false,
        hasTokenCreated: true,
        mustUnderstand: options.mustUnderstand ?? true,
      });


      this.client = (await soap.createClientAsync(this.wsdlUrl, this.wsdlOptions)) as SoapClientType;

      if (!this.client) {
        throw new Error('SOAP client creation returned null');
      }

      this.client.setSecurity(this.security);

      return {
        call: async <T = any>(method: string, args: any): Promise<SoapClientResponse<T>> => {
          try {
            const methodName = `${method}Async`;

            if (typeof this.client?.[methodName] !== 'function') {
              throw new Error(`Method ${methodName} not found on SOAP client`);
            }

            const result = await this.client[methodName](args);

            const response = Array.isArray(result) ? result[0] : result;
            const rawResponse = Array.isArray(result) && result[1] ? result[1] : null;
            const soapHeader = Array.isArray(result) && result[2] ? result[2] : null;

            return {
              result: response,
              response: rawResponse,
              rawResponse: rawResponse ? rawResponse.toString() : '',
              soapHeader,
            };
          } catch (error) {
            console.error(`Error calling SOAP method ${method}:`, error);
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
    } catch (error) {
      console.error('Error creating SOAP client:', error);
      throw new Error(`Failed to create SOAP client: ${error.message}`);
    }
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