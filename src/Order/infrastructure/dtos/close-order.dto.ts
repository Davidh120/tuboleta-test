import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CloseOrderPurchaserInfoDto {
  @IsString()
  @IsNotEmpty()
  contactReference: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export class CloseOrderRequestDto {
  @ValidateNested()
  @Type(() => CloseOrderPurchaserInfoDto)
  @IsNotEmpty()
  purchaserInfo: CloseOrderPurchaserInfoDto;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsBoolean()
  @IsNotEmpty()
  generateBarCodes: boolean;

  @IsNumber()
  @IsNotEmpty()
  maxWaitingTime: number;

  @IsString()
  @IsNotEmpty()
  orderType: string;

  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsBoolean()
  forceClose?: boolean;
}
