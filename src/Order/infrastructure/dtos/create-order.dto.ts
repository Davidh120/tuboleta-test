import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaserInfoDto {
  @ApiProperty({
    description: 'Referencia de contacto del comprador',
    example: 'CLIENTE123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  contactReference: string;
}

export class SimpleProductOperationDto {
  @ApiProperty({
    description: 'ID de la subcategoría de audiencia',
    example: 'SUBCAT123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  audienceSubCategoryId: string;

  @ApiProperty({
    description: 'Cantidad de productos',
    example: 2,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'ID del ítem',
    example: 'ITEM123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  itemId: string;
}

export class CreateOrderRequestDto {
  @ApiProperty({
    description: 'ID del punto de venta',
    example: 'POS123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  pointOfSalesId: string;

  @ApiProperty({
    description: 'Tipo de orden',
    example: 'ORD123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  orderType: string;

  @ApiProperty({
    description: 'Información del comprador',
    type: PurchaserInfoDto,
    required: true
  })
  @ValidateNested()
  @Type(() => PurchaserInfoDto)
  purchasersInfo: PurchaserInfoDto;

  @ApiProperty({
    description: 'Operaciones de productos simples',
    type: [SimpleProductOperationDto],
    required: true
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SimpleProductOperationDto)
  simpleProductOperations: SimpleProductOperationDto[];

  @ApiProperty({
    description: 'Referencia externa',
    example: 'ORD123',
    required: false
  })
  @IsOptional()
  @IsString()
  externalReference?: string;

  @ApiProperty({
    description: 'Forzar actualización',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  forceUpdate?: boolean;
}
