import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceType } from 'src/models/entities/serviceType.entity';
import { ServiceTypeRepository } from 'src/models/repositories/serviceType.repository';
import { ServiceTypeController } from './serviceType.controller';
import { ServiceTypeService } from './serviceType.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceType])],
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService, ServiceTypeRepository],
  exports: [ServiceTypeService],
})
export class ServiceTypeModule {}
