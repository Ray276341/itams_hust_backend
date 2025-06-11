import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class DepartmentQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  locationId: number;
}
