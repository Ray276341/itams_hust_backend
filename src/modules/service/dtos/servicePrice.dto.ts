import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class ServicePriceDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  servicePriceId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  serviceId: number;

  @ApiProperty()
  @IsOptional()
  purchase_cost: number;

  @ApiProperty()
  @IsOptional()
  purchase_date: Date;

  @ApiProperty()
  @IsOptional()
  expiration_date: Date;

  @ApiProperty()
  @IsOptional()
  pricing_model: string;

  @ApiProperty()
  @IsOptional()
  unit: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  unit_price: number;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  withDeleted: boolean;
}
