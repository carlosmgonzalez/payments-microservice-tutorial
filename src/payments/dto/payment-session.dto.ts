import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PaymentSessionDto {
  @IsString()
  readonly orderId: string;

  @IsString()
  readonly currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentSessionItemDto)
  readonly items: PaymentSessionItemDto[];
}

export class PaymentSessionItemDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  @IsPositive()
  readonly price: number;

  @IsNumber()
  @IsPositive()
  readonly quantity: number;
}
