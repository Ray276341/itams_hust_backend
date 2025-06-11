import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateSoftwareUsageDto {
  @IsNotEmpty()
  @IsNumber()
  licenseId: number;

  @IsNotEmpty()
  @IsNumber()
  assetId: number;

  @IsNotEmpty()
  @IsString()
  usage_metric: string;

  @IsNotEmpty()
  @IsString()
  usage_value: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsDateString()
  record_at?: Date; // ISO date string
}