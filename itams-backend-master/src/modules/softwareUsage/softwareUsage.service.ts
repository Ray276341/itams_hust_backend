import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SoftwareUsage from 'src/models/entities/softwareUsage.entity';
import { CreateSoftwareUsageDto } from './dtos/createSoftwareUsage.dto';
import { UpdateSoftwareUsageDto } from './dtos/updateSoftwareUsage.dto';

@Injectable()
export class SoftwareUsageService {
  constructor(
    @InjectRepository(SoftwareUsage)
    private readonly repo: Repository<SoftwareUsage>,
  ) {}

  async create(dto: CreateSoftwareUsageDto): Promise<SoftwareUsage> {
    const usage = this.repo.create({
      license: { id: dto.licenseId } as any,
      asset: { id: dto.assetId } as any,
      usage_metric: dto.usage_metric,
      usage_value: dto.usage_value,
      cost: dto.cost ?? 0,
      record_at: dto.record_at ? new Date(dto.record_at) : new Date(),
    });
    return this.repo.save(usage);
  }

  async findOne(id: number): Promise<SoftwareUsage> {
    const usage = await this.repo.findOne({
      where: { id },
      relations: ['license', 'asset'],
    });
    if (!usage) throw new NotFoundException(`SoftwareUsage #${id} not found`);
    return usage;
  }

  async update(id: number, dto: UpdateSoftwareUsageDto): Promise<SoftwareUsage> {
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

  async findByLicense(licenseId: number): Promise<SoftwareUsage[]> {
    return this.repo.find({ where: { license: { id: licenseId } }, relations: ['asset'] });
  }

  async findByAsset(assetId: number): Promise<SoftwareUsage[]> {
    return this.repo.find({ where: { asset: { id: assetId } }, relations: ['license'] });
  }

  async findByMetric(usage_metric: string): Promise<SoftwareUsage[]> {
    return this.repo.find({ where: { usage_metric }, relations: ['license', 'asset'] });
  }
}
