import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export default ChangePasswordDto;
