import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ServiceUsage from 'src/models/entities/serviceUsage.entity';
import Service from 'src/models/entities/service.entity';
import UserEntity from 'src/models/entities/user.entity';
import { ServiceUsageService } from './serviceUsage.service';
import { ServiceUsageController } from './serviceUsage.controller';
import { ServiceModule } from '../service/service.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceUsage, Service, UserEntity]),
    forwardRef(() => ServiceModule),
    forwardRef(() => UsersModule),
  ],
  providers: [ServiceUsageService],
  controllers: [ServiceUsageController],
  exports: [ServiceUsageService],
})
export class ServiceUsageModule {}
