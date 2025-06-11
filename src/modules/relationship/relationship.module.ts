import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relationship } from 'src/models/entities/relationship.entity';
import { RelationshipRepository } from 'src/models/repositories/relationship.repository';
import { RelationshipController } from './relationship.controller';
import { RelationshipService } from './relationship.service';

@Module({
  imports: [TypeOrmModule.forFeature([Relationship])],
  controllers: [RelationshipController],
  providers: [RelationshipService, RelationshipRepository],
  exports: [RelationshipService],
})
export class RelationshipModule {}
