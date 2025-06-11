import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class ServiceToUserQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  serviceId: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  withDeleted: boolean;
}
