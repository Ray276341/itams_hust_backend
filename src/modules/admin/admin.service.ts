import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AdminEntity from 'src/models/entities/admin.entity';
import { AdminRepository } from 'src/models/repositories/admin.repository';
import { AVATAR_PATH } from './admin.constants';
import * as bcrypt from 'bcrypt';
import UpdateProfileDto from './dtos/update-profile.dto';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AdminService {
  private logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(AdminEntity)
    private adminRepo: AdminRepository,
    private firebaseService: FirebaseService,
  ) {}

  async getAdminByUsername(username: string) {
    const admin = await this.adminRepo.findOneBy({ username });

    if (admin) {
      return admin;
    }
  }

  async getAllAdmins() {
    const admins = await this.adminRepo.find();
    return admins;
  }

  async getAdminById(id: number) {
    const admin = await this.adminRepo.findOneBy({ id });

    if (admin) {
      return admin;
    }

    throw new HttpException(
      'No admin with this ID has been found',
      HttpStatus.NOT_FOUND,
    );
  }

  async saveAvatar(admin: AdminEntity, file: Express.Multer.File) {
    // upload ảnh lên storage
    const avatar = await this.uploadImage(file, AVATAR_PATH);
    // cập nhật db
    await this.adminRepo.update({ id: admin.id }, { avatar });
    const newAdmin = await this.getAdminById(admin.id);
    return newAdmin;
  }

  async uploadImage(file: Express.Multer.File, path: string) {
    let url: string = await this.firebaseService.uploadFile(file, path);
    return url;
  }

  async updateProfile(adminId: number, adminData: UpdateProfileDto) {
    let toUpdate = await this.getAdminById(adminId);

    // TODO why delete?
    delete toUpdate.password;
    delete toUpdate.username;

    let updated = Object.assign(toUpdate, adminData);
    return await this.adminRepo.save(updated);
  }

  async setNewPassword(username: string, password: string) {
    const admin = await this.getAdminByUsername(username);

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.adminRepo.update(admin.id, {
      password: hashedPassword,
    });
  }
}
