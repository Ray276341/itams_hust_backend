import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AssetModel from 'src/models/entities/assetModel.entity';
import { AssetModelRepository } from 'src/models/repositories/assetModel.repository';
import { AssetModelController } from './assetModel.controller';
import { AssetModelService } from './assetModel.service';
import { CategoryModule } from '../category/category.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetModel]),
    CategoryModule,
    ManufacturerModule,
  ],
  controllers: [AssetModelController],
  providers: [AssetModelService, AssetModelRepository],
  exports: [AssetModelService],
})
export class AssetModelModule {}
