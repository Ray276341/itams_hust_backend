import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckoutServiceDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  serviceId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  checkout_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  checkout_note: string;
}
