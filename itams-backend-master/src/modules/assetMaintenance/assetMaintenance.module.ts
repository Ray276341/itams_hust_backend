import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetMaintenance } from 'src/models/entities/assetMaintenance.entity';
import { AssetMaintenanceRepository } from 'src/models/repositories/assetMaintenance.repository';
import { AssetModule } from '../asset/asset.module';
import { SupplierModule } from '../supplier/supplier.module';
import { AssetMaintenanceController } from './assetMaintenance.controller';
import { AssetMaintenanceService } from './assetMaintenance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetMaintenance]),
    AssetModule,
    SupplierModule,
  ],
  controllers: [AssetMaintenanceController],
  providers: [AssetMaintenanceService, AssetMaintenanceRepository],
  exports: [AssetMaintenanceService],
})
export class AssetMaintenanceModule {}
