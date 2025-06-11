import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Asset from 'src/models/entities/asset.entity';
import AssetToUser from 'src/models/entities/assetToUser.entity';
import { RequestAsset } from 'src/models/entities/requestAssest.entity';
import { AssetRepository } from 'src/models/repositories/asset.repository';
import { AssetToUserRepository } from 'src/models/repositories/assetToUser.repository';
import { RequestAssetRepository } from 'src/models/repositories/requestAsset.repository';
import { AdminModule } from '../admin/admin.module';
import { AssetModelModule } from '../assetModel/assetModel.module';
import { CategoryModule } from '../category/category.module';
import { DepartmentModule } from '../department/department.module';
import { DeprecationModule } from '../deprecation/deprecation.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';
import { NotificationModule } from '../notification/notification.module';
import { StatusModule } from '../status/status.module';
import { SupplierModule } from '../supplier/supplier.module';
import { UsersModule } from '../users/users.module';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, AssetToUser, RequestAsset]),
    UsersModule,
    AdminModule,
    AssetModelModule,
    DepartmentModule,
    StatusModule,
    SupplierModule,
    CategoryModule,
    DeprecationModule,
    forwardRef(() => NotificationModule),
  ],
  controllers: [AssetController],
  providers: [
    AssetService,
    AssetRepository,
    AssetToUserRepository,
    RequestAssetRepository,
  ],
  exports: [AssetService],
})
export class AssetModule {}
