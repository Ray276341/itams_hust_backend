import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SoftwareUsage from 'src/models/entities/softwareUsage.entity';
import License from 'src/models/entities/license.entity';
import Asset from 'src/models/entities/asset.entity';
import { SoftwareUsageService } from './softwareUsage.service';
import { SoftwareUsageController } from './softwareUsage.controller';
import { LicenseModule } from '../license/license.module';
import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SoftwareUsage, License, Asset]),
    forwardRef(() => LicenseModule),
    forwardRef(() => AssetModule),
  ],
  providers: [SoftwareUsageService],
  controllers: [SoftwareUsageController],
  exports: [SoftwareUsageService],
})
export class SoftwareUsageModule {}
