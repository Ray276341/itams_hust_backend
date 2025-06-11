import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class SourceCodeToUserQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  sourceCodeId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  withDeleted: boolean;
}
