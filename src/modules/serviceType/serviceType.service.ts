import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceType } from 'src/models/entities/serviceType.entity';
import { ServiceTypeRepository } from 'src/models/repositories/serviceType.repository';
import { ServiceTypeDto } from './dtos/serviceType.dto';

@Injectable()
export class ServiceTypeService {
  private logger = new Logger(ServiceTypeService.name);

  constructor(
    @InjectRepository(ServiceType) private serviceTypeRepo: ServiceTypeRepository,
  ) {}

  async getAllServiceTypes() {
    const serviceTypes = await this.serviceTypeRepo.find({
      relations: { services: true },
    });
    const res = serviceTypes.map((serviceType) => {
      const { services, ...rest } = serviceType;
      return {
        ...rest,
        services: services?.length ?? 0,
      };
    });
    return res;
  }

  async getServiceTypeById(id: number) {
    const serviceType = await this.serviceTypeRepo.findOneBy({ id });
    return serviceType;
  }

  async createNewServiceType(serviceTypeDto: ServiceTypeDto) {
    if (await this.serviceTypeRepo.findOneBy({ name: serviceTypeDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const serviceType = new ServiceType();
    serviceType.name = serviceTypeDto.name;
    await this.serviceTypeRepo.save(serviceType);
    return serviceType;
  }

  async updateServiceType(id: number, serviceTypeDto: ServiceTypeDto) {
    if (
      (await this.serviceTypeRepo.findOneBy({ id }))?.name !== serviceTypeDto.name &&
      (await this.serviceTypeRepo.findOneBy({ name: serviceTypeDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    let toUpdate = await this.serviceTypeRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, serviceTypeDto);
    return await this.serviceTypeRepo.save(updated);
  }

  async deleteServiceType(id: number) {
    try {
      return await this.serviceTypeRepo.delete({ id });
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
