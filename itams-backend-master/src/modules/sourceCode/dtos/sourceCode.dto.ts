import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SourceCodeDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty()
  @IsOptional()
  start_date: Date;

  @ApiProperty()
  @IsOptional()
  end_date: Date;
}
