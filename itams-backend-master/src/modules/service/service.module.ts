import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Service from 'src/models/entities/service.entity';
import ServiceToUser from 'src/models/entities/serviceToUser.entity';
import ServicePrice from 'src/models/entities/servicePrice.entity';
import { ServiceRepository } from 'src/models/repositories/service.repository';
import { ServiceToUserRepository } from 'src/models/repositories/serviceToUser.repository';
import { ServicePriceRepository } from 'src/models/repositories/servicePrice.repository';
import { UsersModule } from '../users/users.module';
import { CategoryModule } from '../category/category.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';
import { NotificationModule } from '../notification/notification.module';
import { SupplierModule } from '../supplier/supplier.module';
import { ServiceTypeModule } from '../serviceType/serviceType.module';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import ServiceUpdate from 'src/models/entities/serviceUpdate.entity';
import { ServiceUpdateRepository } from 'src/models/repositories/serviceUpdate.repository';
import { ServiceUpdateModule } from '../serviceUpdate/serviceUpdate.module';
import { AdminModule } from '../admin/admin.module';
import { RequestServiceRepository } from 'src/models/repositories/requestService.repository';
import { RequestService } from 'src/models/entities/requestService.entity';
import { StatusModule } from '../status/status.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, ServiceToUser, ServicePrice, ServiceUpdate, RequestService]),
    forwardRef(() => UsersModule),
    AdminModule,
    StatusModule,
    ServiceTypeModule,
    CategoryModule,
    ManufacturerModule,
    SupplierModule,
    forwardRef(() => NotificationModule),
    forwardRef(() => ServiceUpdateModule),
  ],
  controllers: [ServiceController],
  providers: [ServiceService, ServiceRepository, ServicePriceRepository, ServiceToUserRepository, RequestServiceRepository],
  exports: [ServiceService],
})
export class ServiceModule {}
