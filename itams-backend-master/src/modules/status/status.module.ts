import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Status from 'src/models/entities/status.entity';
import { StatusRepository } from 'src/models/repositories/status.repository';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  controllers: [StatusController],
  providers: [StatusService, StatusRepository],
  exports: [StatusService],
})
export class StatusModule {}
