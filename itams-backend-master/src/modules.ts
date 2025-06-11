import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AssetModule } from './modules/asset/asset.module';
import { CategoryModule } from './modules/category/category.module';
import { AdminModule } from './modules/admin/admin.module';
import { ManufacturerModule } from './modules/manufacturer/manufacturer.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { StatusModule } from './modules/status/status.module';
import { LocationModule } from './modules/location/location.module';
import { DepartmentModule } from './modules/department/department.module';
import { LicenseModule } from './modules/license/license.module';
import { SourceCodeModule } from './modules/sourceCode/sourceCode.module';
import { DigitalContentModule } from './modules/digitalContent/digitalContent.module';
import { DeprecationModule } from './modules/deprecation/deprecation.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './modules/notification/notification.module';
import { AssetMaintenanceModule } from './modules/assetMaintenance/assetMaintenance.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { MailModule } from './modules/mail/mail.module';
import { ServiceTypeModule } from './modules/serviceType/serviceType.module';
import { ServiceModule } from './modules/service/service.module';
import { RelationshipModule } from './modules/relationship/relationship.module';
import { ServiceDependencyModule } from './modules/serviceDependency/serviceDependency.module';
import { ServiceUpdateModule } from './modules/serviceUpdate/serviceUpdate.module';
import { SoftwareDependencyModule } from './modules/softwareDependency/softwareDependency.module';
import { SoftwareUpdateModule } from './modules/softwareUpdate/softwareUpdate.module';
import { SoftwareUsageModule } from './modules/softwareUsage/softwareUsage.module';
import { ServiceUsageModule } from './modules/serviceUsage/serviceUsage.module';

export const Modules = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [__dirname + '/models/entities/**/*{.ts,.js}'],
    synchronize: true,
  }),
  ScheduleModule.forRoot(),
  AuthModule,
  UsersModule,
  AdminModule,
  AssetModule,
  AssetMaintenanceModule,
  CategoryModule,
  ManufacturerModule,
  SupplierModule,
  StatusModule,
  LocationModule,
  DepartmentModule,
  LicenseModule,
  SourceCodeModule,
  DigitalContentModule,
  DeprecationModule,
  NotificationModule,
  InventoryModule,
  MailModule,
  ServiceTypeModule,
  ServiceModule,
  RelationshipModule,
  ServiceDependencyModule,
  ServiceUpdateModule,
  SoftwareDependencyModule,
  SoftwareUpdateModule,
  SoftwareUsageModule,
  ServiceUsageModule,
];
