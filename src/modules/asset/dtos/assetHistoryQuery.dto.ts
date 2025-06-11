import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class AssetHistoryQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  assetId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  userId: number;
}
