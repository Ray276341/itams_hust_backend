import { IsString } from 'class-validator';

export default class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
