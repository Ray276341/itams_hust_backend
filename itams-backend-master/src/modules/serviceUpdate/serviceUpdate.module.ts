import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ServiceUpdate from 'src/models/entities/serviceUpdate.entity';
import Service from 'src/models/entities/service.entity';
import { ServiceUpdateService } from './serviceUpdate.service';
import { ServiceUpdateController } from './serviceUpdate.controller';
import { ServiceModule } from '../service/service.module';
import ServiceToUser from 'src/models/entities/serviceToUser.entity';
import ServiceDependency from 'src/models/entities/serviceDependency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceUpdate, Service, ServiceToUser, ServiceDependency]),
    forwardRef(() => ServiceModule),
  ],
  providers: [ServiceUpdateService],
  controllers: [ServiceUpdateController],
  exports: [ServiceUpdateService],
})
export class ServiceUpdateModule {}