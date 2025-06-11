import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from 'src/models/entities/manufacturer.entity';
import { ManufacturerRepository } from 'src/models/repositories/manufacturer.repository';
import { ManufacturerController } from './manufacturer.controller';
import { ManufacturerService } from './manufacturer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer])],
  controllers: [ManufacturerController],
  providers: [ManufacturerService, ManufacturerRepository],
  exports: [ManufacturerService],
})
export class ManufacturerModule {}
