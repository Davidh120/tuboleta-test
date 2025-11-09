import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaserInfoDto {
  @IsString()
  @IsNotEmpty()
  contactReference: string;
}

export class SimpleProductOperationDto {
  @IsString()
  @IsNotEmpty()
  audienceSubCategoryId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  itemId: string;
}

export class CreateOrderRequestDto {
  @IsString()
  @IsNotEmpty()
  pointOfSalesId: string;

  @IsString()
  @IsNotEmpty()
  orderType: string;

  @ValidateNested()
  @Type(() => PurchaserInfoDto)
  purchasersInfo: PurchaserInfoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SimpleProductOperationDto)
  simpleProductOperations: SimpleProductOperationDto[];

  @IsOptional()
  @IsString()
  externalReference?: string;

  @IsOptional()
  @IsBoolean()
  forceUpdate?: boolean;
}
