import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateServiceToInventoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  serviceId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  newStatusId: number;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  new_cost: number;

  @ApiProperty()
  @IsNotEmpty()
  check: boolean;
}
