import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class AssetQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  assetModelId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  departmentId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  statusId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  supplierId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  userId: number;
}
