import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Status from 'src/models/entities/status.entity';
import { StatusRepository } from 'src/models/repositories/status.repository';
import { StatusDto } from './dtos/status.dto';

@Injectable()
export class StatusService {
  private logger = new Logger(StatusService.name);

  constructor(@InjectRepository(Status) private statusRepo: StatusRepository) {}

  async getAllStatuses() {
    const statuses = await this.statusRepo.find({
      relations: { assets: true, licenses: true, services: true },
    });
    const res = statuses.map((status) => {
      const { assets, licenses, services, ...rest } = status;
      return {
        ...rest,
        numOfAssets: assets.length,
        numOfLicenses: licenses.length,
        numOfServices: services.length,
      };
    });
    return res;
  }

  async getStatusById(id: number) {
    const status = await this.statusRepo.findOneBy({ id });
    return status;
  }

  async createNewStatus(statusDto: StatusDto) {
    if (await this.statusRepo.findOneBy({ name: statusDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const status = new Status();
    status.name = statusDto.name;
    status.color = statusDto.color;
    await this.statusRepo.save(status);
    return status;
  }

  async updateStatus(id: number, statusDto: StatusDto) {
    if (
      (await this.statusRepo.findOneBy({ id }))?.name !== statusDto.name &&
      (await this.statusRepo.findOneBy({ name: statusDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    let toUpdate = await this.statusRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, statusDto);
    return await this.statusRepo.save(updated);
  }

  async deleteStatus(id: number) {
    try {
      return await this.statusRepo.delete({ id });
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
