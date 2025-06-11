import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import RegisterDto from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByUsername(username);
    if (user && (await this.checkPassword(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateAdmin(username: string, pass: string): Promise<any> {
    const admin = await this.adminService.getAdminByUsername(username);
    if (admin && (await this.checkPassword(pass, admin.password))) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginAdmin(admin: any) {
    const payload = { username: admin.username, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async createUser(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    try {
      const newUser = await this.usersService.createUser({
        ...registerDto,
        password: hashedPassword,
      });

      return newUser;
    } catch (error) {
      if (error?.code == 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Email has already been taken',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changePassword(
    username: string,
    hashPassword: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const isPasswordTrue = await this.checkPassword(
      currentPassword,
      hashPassword,
    );
    if (!isPasswordTrue)
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    await this.usersService.setNewPassword(username, newPassword);
  }

  async changePasswordAdmin(
    username: string,
    hashPassword: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const isPasswordTrue = await this.checkPassword(
      currentPassword,
      hashPassword,
    );
    if (!isPasswordTrue)
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    await this.adminService.setNewPassword(username, newPassword);
  }

  private async checkPassword(rawPassword: string, hashedPassword: string) {
    const isPasswordTrue = await bcrypt.compare(rawPassword, hashedPassword);
    return isPasswordTrue;
  }
}
