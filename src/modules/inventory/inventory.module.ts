import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AssetToInventory from 'src/models/entities/assetToInventory.entity';
import LicenseToInventory from 'src/models/entities/licenseToInventory.entity';
import ServiceToInventory from 'src/models/entities/serviceToInventory.entity';
import Inventory from 'src/models/entities/inventory.entity';
import { AssetToInventoryRepository } from 'src/models/repositories/assetToInventory.repository';
import { LicenseToInventoryRepository } from 'src/models/repositories/licenseToInventory.repository';
import { ServiceToInventoryRepository } from 'src/models/repositories/serviceToInventory.repository';
import { InventoryRepository } from 'src/models/repositories/inventory.repository';
import { AssetModule } from '../asset/asset.module';
import { LicenseModule } from '../license/license.module';
import { ServiceModule } from '../service/service.module';
import { DepartmentModule } from '../department/department.module';
import { StatusModule } from '../status/status.module';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { LicenseToAssetRepository } from 'src/models/repositories/licenseToAsset.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { ServiceToUserRepository } from 'src/models/repositories/serviceToUser.repository';
import { UsersModule } from '../users/users.module';
import LicenseToAsset from 'src/models/entities/licenseToAsset.entity';
import ServiceToUser from 'src/models/entities/serviceToUser.entity';
import { LicenseRepository } from 'src/models/repositories/license.repository';
import { ServiceRepository } from 'src/models/repositories/service.repository';
import License from 'src/models/entities/license.entity';
import Service from 'src/models/entities/service.entity';
import Deprecation from 'src/models/entities/deprecation.entity';
import { DeprecationRepository } from 'src/models/repositories/deprecation.repository';
import ServicePrice from 'src/models/entities/servicePrice.entity';
import ServiceUsage from 'src/models/entities/serviceUsage.entity';
import { ServicePriceRepository } from 'src/models/repositories/servicePrice.repository';
import { ServiceUsageRepository } from 'src/models/repositories/serviceUsage.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, AssetToInventory, LicenseToInventory, ServiceToInventory, LicenseToAsset, ServiceToUser, License, Service, ServicePrice, ServiceUsage, Deprecation]),
    DepartmentModule,
    AssetModule,
    LicenseModule,
    ServiceModule,
    UsersModule,
    StatusModule,
  ],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    InventoryRepository,
    AssetToInventoryRepository,
    LicenseToInventoryRepository,
    ServiceToInventoryRepository,
    LicenseToAssetRepository,
    UserRepository,
    ServiceToUserRepository,
    LicenseRepository,
    ServiceRepository,
    ServicePriceRepository,
    ServiceUsageRepository,
    DeprecationRepository,
  ],
  exports: [InventoryService],
})
export class InventoryModule {}
