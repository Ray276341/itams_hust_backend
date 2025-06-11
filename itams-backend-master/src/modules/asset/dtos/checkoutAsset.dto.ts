import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckoutAssetDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  assetId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  statusId: number;

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
