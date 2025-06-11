import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckoutSourceCodeDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  sourceCodeId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  start_note: string;
}
