import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewRequestService {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;
}
