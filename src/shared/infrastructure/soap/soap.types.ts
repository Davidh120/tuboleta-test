export interface SoapClientOptions {
  wsdlUrl: string;
  username: string;
  password: string;
  wsdlOptions?: any;
}

export interface SoapClientResponse<T = any> {
  result: T;
  response: any;
  rawResponse: string;
  soapHeader: any;
}

export interface SoapClient {
  call<T = any>(method: string, args: any): Promise<SoapClientResponse<T>>;
  setSecurity(security: any): void;
  getClient(): any;
}