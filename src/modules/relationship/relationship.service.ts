import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Relationship } from 'src/models/entities/relationship.entity';
import { RelationshipRepository } from 'src/models/repositories/relationship.repository';
import { RelationshipDto } from './dtos/relationship.dto';

@Injectable()
export class RelationshipService {
  private logger = new Logger(RelationshipService.name);

  constructor(
    @InjectRepository(Relationship) private relationshipRepo: RelationshipRepository,
  ) {}

  async getAllRelationships() {
    const relationships = await this.relationshipRepo.find({
      relations: { relationshipServiceEntries: true, relationshipLicenseEntries: true },
    });
    const res = relationships.map((rel) => {
      const { relationshipLicenseEntries, relationshipServiceEntries, ...rest } = rel;
      return {
        ...rest,
        relationshipLicenseEntries: relationshipLicenseEntries?.length ?? 0,
        relationshipServiceEntries: relationshipServiceEntries?.length ?? 0,
      };
    });
    return res;
  }

  async getRelationshipById(id: number) {
    const relationship = await this.relationshipRepo.findOneBy({ id });
    return relationship;
  }

  async createNewRelationship(relationshipDto: RelationshipDto) {
    if (await this.relationshipRepo.findOneBy({ name: relationshipDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const relationship = new Relationship();
    relationship.name = relationshipDto.name;
    await this.relationshipRepo.save(relationship);
    return relationship;
  }

  async updateRelationship(id: number, relationshipDto: RelationshipDto) {
    if (
      (await this.relationshipRepo.findOneBy({ id }))?.name !== relationshipDto.name &&
      (await this.relationshipRepo.findOneBy({ name: relationshipDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    let toUpdate = await this.relationshipRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, relationshipDto);
    return await this.relationshipRepo.save(updated);
  }

  async deleteRelationship(id: number) {
    try {
      return await this.relationshipRepo.delete({ id });
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
