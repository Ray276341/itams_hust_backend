import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckinSourceCodeDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  sourceCodeToUserId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  end_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  end_note: string;
}
