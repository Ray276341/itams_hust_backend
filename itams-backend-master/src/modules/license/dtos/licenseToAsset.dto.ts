import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class LicenseToAssetQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  assetId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  licenseId: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  withDeleted: boolean;
}
