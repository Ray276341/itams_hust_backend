import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoftwareDependency } from 'src/models/entities/softwareDependency.entity';
import { SoftwareDependencyDto } from './dtos/softwareDependency.dto';
import { SoftwareDependencyResponseDto } from './dtos/softwareDependencyResponse.dto';

@Injectable()
export class SoftwareDependencyService {
  constructor(
    @InjectRepository(SoftwareDependency)
    private readonly repo: Repository<SoftwareDependency>,
  ) {}

  private toResponse(ent: SoftwareDependency): SoftwareDependencyResponseDto {
    return {
      id: ent.id,
      licenseId: ent.license.id,
      licenseName: ent.license.name,
      dependencyId: ent.dependency.id,
      dependencyName: ent.dependency.name,
      relationshipId: ent.relationship.id,
      relationshipName: ent.relationship.name,
      note: ent.note,
      deletedAt: ent.deletedAt,
    };
  }

  async create(dto: SoftwareDependencyDto): Promise<SoftwareDependencyResponseDto> {
    if (
      dto.licenseId == null ||
      dto.dependencyId == null ||
      dto.relationshipId == null
    ) {
      throw new BadRequestException(
        'licenseId, dependencyId and relationshipId are required',
      );
    }
    const ent = this.repo.create({
      license: { id: dto.licenseId } as any,
      dependency: { id: dto.dependencyId } as any,
      relationship: { id: dto.relationshipId } as any,
      note: dto.note,
    });
    const saved = await this.repo.save(ent);
    const full = await this.repo.findOne({
      where: { id: saved.id },
      relations: ['license', 'dependency', 'relationship'],
    });
    return this.toResponse(full!);
  }

  async findOne(id: number): Promise<SoftwareDependencyResponseDto> {
    const ent = await this.repo.findOne({
      where: { id },
      relations: ['license', 'dependency', 'relationship'],
    });
    if (!ent) throw new NotFoundException(`SoftwareDependency ${id} not found`);
    return this.toResponse(ent);
  }

  async findOutgoing(
    licenseId: number,
  ): Promise<SoftwareDependencyResponseDto[]> {
    const list = await this.repo.find({
      where: { license: { id: licenseId } },
      relations: ['license', 'dependency', 'relationship'],
    });
    return list.map((ent) => this.toResponse(ent));
  }

  async findIncoming(
    licenseId: number,
  ): Promise<SoftwareDependencyResponseDto[]> {
    const list = await this.repo.find({
      where: { dependency: { id: licenseId } },
      relations: ['license', 'dependency', 'relationship'],
    });
    return list.map((ent) => this.toResponse(ent));
  }

  async update(
    id: number,
    dto: SoftwareDependencyDto,
  ): Promise<SoftwareDependencyResponseDto> {
    const ent = await this.repo.findOne({
      where: { id },
      relations: ['license', 'dependency', 'relationship'],
    });
    if (!ent) throw new NotFoundException(`SoftwareDependency ${id} not found`);
    if (dto.licenseId) ent.license = { id: dto.licenseId } as any;
    if (dto.dependencyId) ent.dependency = { id: dto.dependencyId } as any;
    if (dto.relationshipId) ent.relationship = { id: dto.relationshipId } as any;
    if (dto.note !== undefined) ent.note = dto.note;
    const updated = await this.repo.save(ent);
    const full = await this.repo.findOne({
      where: { id: updated.id },
      relations: ['license', 'dependency', 'relationship'],
    });
    return this.toResponse(full!);
  }

  async remove(id: number): Promise<{ deleted: true }> {
    const ent = await this.repo.findOne({
      where: { id },
      relations: ['license', 'dependency', 'relationship'],
    });
    if (!ent) throw new NotFoundException(`SoftwareDependency ${id} not found`);
    await this.repo.softRemove(ent);
    return { deleted: true };
  }
}