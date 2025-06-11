import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AssetMaintenanceDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  assetId: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  supplierId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty()
  @IsOptional()
  end_date: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cost: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;
}
