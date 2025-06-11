import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import ServiceUpdate from 'src/models/entities/serviceUpdate.entity';
import Service from 'src/models/entities/service.entity';
import { CreateServiceUpdateDto } from './dtos/createServiceUpdate.dto';
import { UpdateServiceUpdateDto } from './dtos/updateServiceUpdate.dto';
import ServiceToUser from 'src/models/entities/serviceToUser.entity';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import ServiceDependency from 'src/models/entities/serviceDependency.entity';

@Injectable()
export class ServiceUpdateService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ServiceUpdate)
    private readonly updateRepo: Repository<ServiceUpdate>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(ServiceToUser)
    private readonly serviceToUserRepo: Repository<ServiceToUser>,
    @InjectRepository(ServiceDependency)
    private readonly dependencyRepo: Repository<ServiceDependency>,
    //private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateServiceUpdateDto): Promise<ServiceUpdate> {
    const service = await this.serviceRepo.findOneBy({ id: dto.serviceId });
    if (!service) throw new NotFoundException('Service not found');

    const toSave = this.updateRepo.create({
      service,
      version: dto.version,
      release_date: dto.release_date,
      note: dto.note,
    });
    const saved = await this.updateRepo.save(toSave);

    const latest = await this.updateRepo.findOne({
      where: { service: { id: service.id } },
      order: { release_date: 'DESC' },
    });

    if (latest && saved.id === latest.id) {
      service.version = saved.version;
      const updatedService = await this.serviceRepo.save(service);
      await this.notifyServiceUpdate(updatedService);
    }

    return saved;
  }

  private async notifyServiceUpdate(service: Service) {
    const outgoingRaw = await this.dependencyRepo.find({
      where: { service: { id: service.id } },
      relations: ['dependency'],
    });
    const outgoingDeps = outgoingRaw.map(ent => ({
      name: ent.dependency.name,
      version: ent.dependency.version,
    }));

    const incomingRaw = await this.dependencyRepo.find({
      where: { dependency: { id: service.id } },
      relations: ['service'],
    });
    const incomingDeps = incomingRaw.map(ent => ({
      name: ent.service.name,
      version: ent.service.version,
    }));

    const checkedOutRows = await this.serviceToUserRepo.find({
      where: {
        service: { id: service.id },
        checkin_date: IsNull(),
      },
      relations: ['user'],
    });

    const notifiedUserIds = new Set<number>();
    for (const stu of checkedOutRows) {
      const user = stu.user;
      if (!user || notifiedUserIds.has(user.id)) continue;
      notifiedUserIds.add(user.id);

      await this.mailService.sendServiceUpdate(user, service, outgoingDeps, incomingDeps);
    }
  }
  async findAllByService(serviceId: number): Promise<ServiceUpdate[]> {
    return this.updateRepo.find({
      where: { service: { id: serviceId } },
      order: { release_date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ServiceUpdate> {
    const upd = await this.updateRepo.findOne({
      where: { id },
      relations: ['service'],
    });
    if (!upd) throw new NotFoundException('Update not found');
    return upd;
  }

  async update(
    id: number,
    dto: UpdateServiceUpdateDto,
  ): Promise<ServiceUpdate> {
    const existing = await this.findOne(id);

    if (dto.version !== undefined) existing.version = dto.version;
    if (dto.release_date !== undefined) existing.release_date = dto.release_date;
    if (dto.note !== undefined) existing.note = dto.note;

    const saved = await this.updateRepo.save(existing);

    const latest = await this.updateRepo.findOne({
      where: { service: { id: existing.service.id } },
      order: { release_date: 'DESC' },
    });

    if (latest && saved.id === latest.id) {
      const service = await this.serviceRepo.findOneBy({ id: existing.service.id });
      if (service) {
        service.version = saved.version;
        await this.serviceRepo.save(service);
      }
    }

    return saved;
  }

  async remove(id: number): Promise<void> {
    const upd = await this.findOne(id);
    await this.updateRepo.softRemove(upd);
  }
}
