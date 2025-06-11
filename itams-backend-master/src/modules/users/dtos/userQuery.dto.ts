import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UserQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  departmentId: number;
}
