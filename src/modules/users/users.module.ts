import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from 'src/models/entities/user.entity';
import { UserRepository } from 'src/models/repositories/user.repository';
import { BullModule } from '@nestjs/bull';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { DepartmentModule } from '../department/department.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    DepartmentModule,
    FirebaseModule,
  ],
  controllers: [UserController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
