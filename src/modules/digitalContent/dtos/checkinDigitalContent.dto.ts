import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckinDigitalContentDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  digitalContentToSourceCodeId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  checkin_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  checkin_note: string;
}
