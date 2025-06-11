import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Location from 'src/models/entities/location.entity';
import { LocationRepository } from 'src/models/repositories/location.entity';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationService],
})
export class LocationModule {}
