import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AdminEntity from 'src/models/entities/admin.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from 'src/models/repositories/admin.repository';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), FirebaseModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService],
})
export class AdminModule {}
