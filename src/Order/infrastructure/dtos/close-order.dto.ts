import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CloseOrderPurchaserInfoDto {
  @ApiProperty({
    description: 'Referencia de contacto del comprador',
    example: 'CLIENTE123',
    required: true
  })
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
  @ApiProperty({
    description: 'Información del comprador',
    type: CloseOrderPurchaserInfoDto,
    required: true
  })
  @ValidateNested()
  @Type(() => CloseOrderPurchaserInfoDto)
  @IsNotEmpty()
  purchaserInfo: CloseOrderPurchaserInfoDto;

  @ApiProperty({
    description: 'ID de la orden a cerrar',
    example: 'ORD123456',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    description: 'Indica si se deben generar códigos de barras',
    example: true,
    required: true
  })
  @IsBoolean()
  @IsNotEmpty()
  generateBarCodes: boolean;

  @ApiProperty({
    description: 'Tiempo máximo de espera',
    example: 120,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  maxWaitingTime: number;

  @ApiProperty({
    description: 'Tipo de orden',
    example: 'ORD123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  orderType: string;

  @ApiProperty({
    description: 'ID del método de pago',
    example: 'PAY123',
    required: false
  })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @ApiProperty({
    description: 'Referencia del pago',
    example: 'PAY123',
    required: false
  })
  @IsOptional()
  @IsString()
  paymentReference?: string;

  @ApiProperty({
    description: 'Forzar cierre',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  forceClose?: boolean;
}
