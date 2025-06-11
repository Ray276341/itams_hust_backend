import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ServiceDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  statusId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  serviceTypeId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  manufacturerId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  supplierId: number;
}
