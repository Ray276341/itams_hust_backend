import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckoutLicenseDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  licenseId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  assetId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  checkout_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  checkout_note: string;
}
