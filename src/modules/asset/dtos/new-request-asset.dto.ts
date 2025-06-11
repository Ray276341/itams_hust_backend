import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewRequestAsset {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;
}
