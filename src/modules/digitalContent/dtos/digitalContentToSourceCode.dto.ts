import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class DigitalContentToSourceCodeQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  digitalContentId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  sourceCodeId: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  withDeleted: boolean;
}
