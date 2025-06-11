import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckinServiceDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  serviceToUserId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  checkin_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  checkin_note: string;
}
