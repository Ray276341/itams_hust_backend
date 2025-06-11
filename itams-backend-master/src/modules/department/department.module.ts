import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Department from 'src/models/entities/department.entity';
import { DepartmentRepository } from 'src/models/repositories/department.repository';
import { LocationModule } from '../location/location.module';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department]), LocationModule],
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentRepository],
  exports: [DepartmentService],
})
export class DepartmentModule {}
