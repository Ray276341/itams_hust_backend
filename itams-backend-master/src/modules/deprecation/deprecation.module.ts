import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Deprecation from 'src/models/entities/deprecation.entity';
import { DeprecationRepository } from 'src/models/repositories/deprecation.repository';
import { CategoryModule } from '../category/category.module';
import { DeprecationController } from './deprecation.controller';
import { DeprecationService } from './deprecation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Deprecation]), CategoryModule],
  controllers: [DeprecationController],
  providers: [DeprecationService, DeprecationRepository],
  exports: [DeprecationService],
})
export class DeprecationModule {}
