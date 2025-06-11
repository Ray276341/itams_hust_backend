import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ServiceUsage from 'src/models/entities/serviceUsage.entity';
import { CreateServiceUsageDto } from './dtos/createServiceUsage.dto';
import { UpdateServiceUsageDto } from './dtos/updateServiceUsage.dto';

@Injectable()
export class ServiceUsageService {
  constructor(
    @InjectRepository(ServiceUsage)
    private readonly repo: Repository<ServiceUsage>,
  ) {}

  async create(dto: CreateServiceUsageDto): Promise<ServiceUsage> {
    const usage = this.repo.create({
      service: { id: dto.serviceId } as any,
      user: { id: dto.userId } as any,
      usage_metric: dto.usage_metric,
      usage_value: dto.usage_value,
      cost: dto.cost ?? 0,
      record_at: dto.record_at ? new Date(dto.record_at) : new Date(),
    });
    return this.repo.save(usage);
  }

  async findOne(id: number): Promise<ServiceUsage> {
    const usage = await this.repo.findOne({
      where: { id },
      relations: ['service', 'user'],
    });
    if (!usage) throw new NotFoundException(`ServiceUsage #${id} not found`);
    return usage;
  }

  async update(id: number, dto: UpdateServiceUsageDto): Promise<ServiceUsage> {
    const usage = await this.findOne(id);
    const { record_at, ...rest } = dto;
    Object.assign(usage, rest);
    if (record_at) {
      usage.record_at = new Date(record_at);
    }
    return this.repo.save(usage);
  }

  async remove(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }

  async findByService(serviceId: number): Promise<ServiceUsage[]> {
    return this.repo.find({ where: { service: { id: serviceId } }, relations: ['user'] });
  }

  async findByUser(userId: number): Promise<ServiceUsage[]> {
    return this.repo.find({ where: { user: { id: userId } }, relations: ['service'] });
  }

  async findByMetric(usage_metric: string): Promise<ServiceUsage[]> {
    return this.repo.find({ where: { usage_metric }, relations: ['service', 'user'] });
  }
}
