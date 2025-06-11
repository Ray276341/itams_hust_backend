import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from 'src/models/entities/user.entity';
import { UserRepository } from 'src/models/repositories/user.repository';
import CreateUserDto from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AVATAR_PATH } from './user.constants';
import UpdateProfileDto from './dtos/update-profile.dto';
import { DepartmentService } from '../department/department.service';
import { UserDto } from './dtos/user.dto';
import { DataSource } from 'typeorm';
import { FirebaseService } from '../firebase/firebase.service';
import { UserQueryDto } from './dtos/userQuery.dto';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepo: UserRepository,
    private departmentService: DepartmentService,
    private firebaseService: FirebaseService,
  ) {}

  async getAll(userQuery?: UserQueryDto) {
    const users = await this.userRepo.find({
      relations: { department: true, assetToUsers: true },
      where: {
        department: { id: userQuery.departmentId },
      },
    });
    const res = users.map((user) => {
      const { department, assetToUsers, password, ...rest } = user;
      return {
        ...rest,
        department: department?.name,
        assets: assetToUsers?.length,
      };
    });
    return res;
  }

  async getUserByUserId(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { department: true },
    });
    const { department, password, ...rest } = user;
    return { ...rest, department: department.name };
  }

  async createNewUser(userDto: UserDto) {
    const department = await this.departmentService.getDepartmentById(
      userDto.departmentId,
    );

    const user = new UserEntity();
    user.name = userDto.name;
    user.username = userDto.username;
    user.password = await bcrypt.hash(userDto.password, 10);
    user.phone = userDto.phone;
    user.email = userDto.email;
    user.birthday = userDto.birthday;
    user.avatar = userDto.avatar;
    user.department = department;

    await this.userRepo.save(user);
    return user;
  }

  async importUser(userDtos: UserDto[]) {
    await this.dataSource.transaction(async (manager) => {
      await Promise.all(
        userDtos.map(async (userDto: UserDto) => {
          const user = new UserEntity();
          let { password, departmentId, ...rest } = userDto;
          Object.assign(user, rest);
          const department = await this.departmentService.getDepartmentById(
            userDto.departmentId,
          );
          user.password = await bcrypt.hash(userDto.password, 10);
          user.department = department;
          await manager.save(user);
        }),
      );
    });
    return userDtos;
  }

  async updateUser(id: number, userDto: UserDto) {
    let toUpdate = await this.userRepo.findOneBy({ id });
    let { password, departmentId, ...rest } = userDto;
    const department = await this.departmentService.getDepartmentById(
      userDto.departmentId,
    );
    let updated = Object.assign(toUpdate, rest);
    updated.password = await bcrypt.hash(userDto.password, 10);
    updated.department = department;
    return await this.userRepo.save(updated);
  }

  async deleteUser(id: number) {
    const toRemove = await this.userRepo.findOneOrFail({
      where: { id },
      relations: {
        assetToUsers: true,
        sourceCodeToUsers: true,
        requestAssets: true,
      },
    });
    return await this.userRepo.softRemove(toRemove);
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepo.findOneBy({ username });

    if (user) {
      return user;
    }
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    return user;
  }

  async saveAvatar(user: UserEntity, file: Express.Multer.File) {
    // upload ảnh lên storage
    const avatar = await this.uploadImage(file, AVATAR_PATH);
    // cập nhật db
    await this.userRepo.update({ id: user.id }, { avatar });
    const newUser = await this.getUserById(user.id);
    return newUser;
  }

  async uploadImage(file: Express.Multer.File, path: string) {
    let url: string = await this.firebaseService.uploadFile(file, path);
    return url;
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = new UserEntity();
    newUser.username = createUserDto.username;
    newUser.password = createUserDto.password;

    await this.userRepo.save(newUser);

    return newUser;
  }

  async updateProfile(userId: number, userData: UpdateProfileDto) {
    let toUpdate = await this.getUserById(userId);

    // TODO why delete?
    delete toUpdate.password;
    delete toUpdate.username;

    let updated = Object.assign(toUpdate, userData);
    return await this.userRepo.save(updated);
  }

  async setNewPassword(username: string, password: string) {
    const user = await this.getUserByUsername(username);

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepo.update(user.id, {
      password: hashedPassword,
    });
  }

  async getUsersByDepartmentId(id: number) {
    const users: UserEntity[] = await this.userRepo.find({
      where: { department: { id } },
    });
    return users;
  }
}
