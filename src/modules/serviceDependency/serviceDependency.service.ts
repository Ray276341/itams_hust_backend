import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceDependency } from 'src/models/entities/serviceDependency.entity';
import { ServiceDependencyDto } from './dtos/serviceDependency.dto';
import { ServiceDependencyResponseDto } from './dtos/serviceDependencyResponse.dto';

@Injectable()
export class ServiceDependencyService {
  constructor(
    @InjectRepository(ServiceDependency)
    private readonly repo: Repository<ServiceDependency>,
  ) {}

  private toResponse(ent: ServiceDependency): ServiceDependencyResponseDto {
    return {
      id: ent.id,
      serviceId: ent.service.id,
      serviceName: ent.service.name,
      dependencyId: ent.dependency.id,
      dependencyName: ent.dependency.name,
      relationshipId: ent.relationship.id,
      relationshipName: ent.relationship.name,
      note: ent.note,
      deletedAt: ent.deletedAt,
    };
  }

  async create(dto: ServiceDependencyDto): Promise<ServiceDependencyResponseDto> {
    if (
      dto.serviceId == null ||
      dto.dependencyId == null ||
      dto.relationshipId == null
    ) {
      throw new BadRequestException(
        'serviceId, dependencyId and relationshipId are required',
      );
    }
    const ent = this.repo.create({
      service: { id: dto.serviceId } as any,
      dependency: { id: dto.dependencyId } as any,
      relationship: { id: dto.relationshipId } as any,
      note: dto.note,
    });
    const saved = await this.repo.save(ent);
    const full = await this.repo.findOne({
      where: { id: saved.id },
      relations: ['service', 'dependency', 'relationship'],
    });
    return this.toResponse(full!);
  }

  async findOne(id: number): Promise<ServiceDependencyResponseDto> {
    const ent = await this.repo.findOne({
      where: { id },
      relations: ['service', 'dependency', 'relationship'],
    });
    if (!ent) throw new NotFoundException(`ServiceDependency ${id} not found`);
    return this.toResponse(ent);
  }

  async findOutgoing(
    serviceId: number,
  ): Promise<ServiceDependencyResponseDto[]> {
    const list = await this.repo.find({
      where: { service: { id: serviceId } },
      relations: ['service', 'dependency', 'relationship'],
    });
    return list.map((ent) => this.toResponse(ent));
  }

  async findIncoming(
    serviceId: number,
  ): Promise<ServiceDependencyResponseDto[]> {
    const list = await this.repo.find({
      where: { dependency: { id: serviceId } },
      relations: ['service', 'dependency', 'relationship'],
    });
    return list.map((ent) => this.toResponse(ent));
  }

  async update(
    id: number,
    dto: ServiceDependencyDto,
  ): Promise<ServiceDependencyResponseDto> {
    const ent = await this.repo.findOne({
      where: { id },
      relations: ['service', 'dependency', 'relationship'],
    });
    if (!ent) throw new NotFoundException(`ServiceDependency ${id} not found`);
    if (dto.serviceId) ent.service = { id: dto.serviceId } as any;
    if (dto.dependencyId) ent.dependency = { id: dto.dependencyId } as any;
    if (dto.relationshipId) ent.relationship = { id: dto.relationshipId } as any;
    if (dto.note !== undefined) ent.note = dto.note;
    const updated = await this.repo.save(ent);
    const full = await this.repo.findOne({
      where: { id: updated.id },
      relations: ['service', 'dependency', 'relationship'],
    });
    return this.toResponse(full!);
  }

  async remove(id: number): Promise<{ deleted: true }> {
    const ent = await this.repo.findOne({
      where: { id },
      relations: ['service', 'dependency', 'relationship'],
    });
    if (!ent) throw new NotFoundException(`ServiceDependency ${id} not found`);
    await this.repo.softRemove(ent);
    return { deleted: true };
  }
}