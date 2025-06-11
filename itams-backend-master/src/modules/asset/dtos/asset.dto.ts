import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssetDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  purchase_cost: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  purchase_date: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  assetModelId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  departmentId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  statusId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  supplierId: number;
}
