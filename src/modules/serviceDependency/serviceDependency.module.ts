import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceDependency } from 'src/models/entities/serviceDependency.entity';
import { ServiceDependencyService } from './serviceDependency.service';
import { ServiceDependencyController } from './serviceDependency.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceDependency])],
  providers: [ServiceDependencyService],
  controllers: [ServiceDependencyController],
})
export class ServiceDependencyModule {}