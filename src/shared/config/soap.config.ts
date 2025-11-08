import { registerAs } from '@nestjs/config';

export const soapConfig = registerAs('soap', () => ({
  wsdlUrl: process.env.SOAP_WSDL_URL,
  username: process.env.SOAP_USERNAME,
  password: process.env.SOAP_PASSWORD,
}));

export type SoapConfig = ReturnType<typeof soapConfig>;
