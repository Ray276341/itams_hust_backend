import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoftwareDependency } from 'src/models/entities/softwareDependency.entity';
import { SoftwareDependencyService } from './softwareDependency.service';
import { SoftwareDependencyController } from './softwareDependency.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SoftwareDependency])],
  providers: [SoftwareDependencyService],
  controllers: [SoftwareDependencyController],
})
export class SoftwareDependencyModule {}