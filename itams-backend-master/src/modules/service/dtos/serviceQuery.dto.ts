import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class ServiceQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  statusId: number;
  
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  serviceTypeId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  categoryId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  manufacturerId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  supplierId: number;
}
