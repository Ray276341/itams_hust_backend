import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckinAssetDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  assetId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  statusId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  departmentId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  checkin_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  checkin_note: string;
}
