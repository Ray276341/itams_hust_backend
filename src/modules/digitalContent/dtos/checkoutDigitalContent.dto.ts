import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckoutDigitalContentDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  digitalContentId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  sourceCodeId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  checkout_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  checkout_note: string;
}
