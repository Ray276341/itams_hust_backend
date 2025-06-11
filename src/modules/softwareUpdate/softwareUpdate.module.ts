import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SoftwareUpdate from 'src/models/entities/softwareUpdate.entity';
import License from 'src/models/entities/license.entity';
import { SoftwareUpdateService } from './softwareUpdate.service';
import { SoftwareUpdateController } from './softwareUpdate.controller';
import { LicenseModule } from '../license/license.module';
import SoftwareDependency from 'src/models/entities/softwareDependency.entity';
import LicenseToAsset from 'src/models/entities/licenseToAsset.entity';
import AssetToUser from 'src/models/entities/assetToUser.entity';
import { SoftwareDependencyService } from '../softwareDependency/softwareDependency.service';
import { LicenseService } from '../license/license.service';
import { AssetService } from '../asset/asset.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SoftwareUpdate, License, SoftwareDependency, LicenseToAsset, AssetToUser]),
    forwardRef(() => LicenseModule),
  ],
  providers: [SoftwareUpdateService],
  controllers: [SoftwareUpdateController],
  exports: [SoftwareUpdateService],
})
export class SoftwareUpdateModule {}