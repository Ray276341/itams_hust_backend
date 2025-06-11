import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class AssetMaintenanceQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  assetId: number;
}
