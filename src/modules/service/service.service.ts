import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Cron } from '@nestjs/schedule';
import Service from 'src/models/entities/service.entity';
import { ServiceRepository } from 'src/models/repositories/service.repository';
import { CategoryService } from '../category/category.service';
import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { SupplierService } from '../supplier/supplier.service';
import { ServiceTypeService } from '../serviceType/serviceType.service';
import { ServiceDto } from './dtos/service.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/notification.constants';
import { ServiceQueryDto } from './dtos/serviceQuery.dto';
import { CheckoutServiceDto } from './dtos/checkoutService.dto';
import { CheckinServiceDto } from './dtos/checkinService.dto';
import ServiceToUser from 'src/models/entities/serviceToUser.entity';
import { UsersService } from '../users/users.service';
import { ServiceToUserRepository } from 'src/models/repositories/serviceToUser.repository';
import { ServiceToUserQueryDto } from './dtos/serviceToUser.dto';

import ServicePrice from 'src/models/entities/servicePrice.entity';
import { ServicePriceRepository } from 'src/models/repositories/servicePrice.repository';
import { ServicePriceDto } from './dtos/servicePrice.dto';

import ServiceUpdate from 'src/models/entities/serviceUpdate.entity';
import { ServiceUpdateRepository } from 'src/models/repositories/serviceUpdate.repository';
import { ServiceUpdateService } from '../serviceUpdate/serviceUpdate.service';
import { RequestService } from 'src/models/entities/requestService.entity';
import { RequestServiceRepository } from 'src/models/repositories/requestService.repository';
import { MailService } from '../mail/mail.service';
import { AdminService } from '../admin/admin.service';
import { RequestServiceStatus } from './service.constant';
import { NewRequestService } from './dtos/new-request-service.dto';
import { StatusService } from '../status/status.service';
import { Not } from 'typeorm';

@Injectable()
export class ServiceService {
  private logger = new Logger(ServiceService.name);

  constructor(
    @InjectRepository(Service)
    private serviceRepo: ServiceRepository,
    @InjectRepository(ServiceToUser)
    private serviceToUserRepo: ServiceToUserRepository,
    @InjectRepository(ServicePrice)
    private servicePriceRepo: ServicePriceRepository,
    @InjectRepository(RequestService)
    private requestServiceRepo: RequestServiceRepository,
    private serviceUpdateService: ServiceUpdateService,
    private userService: UsersService,
    private statusService: StatusService,
    private serviceTypeService: ServiceTypeService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
    private supplierService: SupplierService,
    private mailService: MailService,
    private adminService: AdminService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async getAll(serviceQuery?: ServiceQueryDto) {
    const services = await this.serviceRepo.find({
      relations: {
        status: true,
        service_type: true,
        category: true,
        manufacturer: true,
        supplier: true,
        serviceToUsers: true,
      },
      where: {
        status: { id: serviceQuery.statusId },
        service_type: { id: serviceQuery.serviceTypeId},
        category: { id: serviceQuery.categoryId },
        manufacturer: { id: serviceQuery.manufacturerId },
        supplier: { id: serviceQuery.supplierId },
      },
    });
    const res = services.map((service) => {
      const { status, service_type, category, manufacturer, supplier, serviceToUsers, ...rest } =
        service;
      return {
        ...rest,
        status: service?.status?.name,
        statusColor: service?.status?.color,
        service_type: service?.service_type?.name,
        category: service?.category?.name,
        manufacturer: service?.manufacturer?.name,
        supplier: service?.supplier?.name,
        used: serviceToUsers?.length,
      };
    });
    return res;
  }

  async getServiceByServiceId(id: number) {
    const service: Service = await this.serviceRepo.findOne({
      where: { id },
      relations: {
        status: true,
        service_type: true,
        category: true,
        manufacturer: true,
        supplier: true,
        serviceToUsers: true,
      },
    });
    const { status, service_type, category, manufacturer, supplier, serviceToUsers, ...rest } =
      service;
    return {
      ...rest,
      status: service?.status?.name,
      statusColor: service?.status?.color,
      service_type: service?.service_type?.name,
      category: service?.category?.name,
      manufacturer: service?.manufacturer?.name,
      supplier: service?.supplier?.name,
      used: serviceToUsers?.length,
    };
  }

  async getServiceToUser(serviceToUserQueryDto?: ServiceToUserQueryDto) {
    const serviceToUsers = await this.serviceToUserRepo.find({
      relations: {
        user: true,
        service: true,
      },
      where: {
        user: { id: serviceToUserQueryDto.userId },
        service: { id: serviceToUserQueryDto.serviceId },
      },
      withDeleted: serviceToUserQueryDto.withDeleted,
    });
    const res = serviceToUsers.map((serviceToUser) => {
      const { user, service, ...rest } = serviceToUser;
      return {
        ...rest,
        userId: user?.id,
        userName: user?.name,
        serviceId: service?.id,
        serviceName: service?.name,
      };
    });
    return res;
  }

  async createNewService(serviceDto: ServiceDto) {
    const status = await this.statusService.getStatusById(
      serviceDto.statusId,
    );
    const serviceType = await this.serviceTypeService.getServiceTypeById(
      serviceDto.serviceTypeId,
    );
    const category = await this.categoryService.getCategoryById(
      serviceDto.categoryId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      serviceDto.manufacturerId,
    );
    const supplier = await this.supplierService.getSupplierById(
      serviceDto.supplierId,
    );

    const service = new Service();
    service.name = serviceDto.name;
    service.version = serviceDto.version;
    service.unit = serviceDto.unit;
    service.description = serviceDto.description;
    service.status = status;
    service.service_type = serviceType;
    service.category = category;
    service.manufacturer = manufacturer;
    service.supplier = supplier;

    await this.serviceRepo.save(service);

    await this.handleCronServiceExpiration();
    return service;
  }

  async updateService(id: number, serviceDto: ServiceDto) {
    let toUpdate = await this.serviceRepo.findOneBy({ id });
    let { statusId, serviceTypeId, categoryId, manufacturerId, supplierId, ...rest } = serviceDto;
    const status = await this.statusService.getStatusById(
      serviceDto.statusId,
    );
    const serviceType = await this.serviceTypeService.getServiceTypeById(
      serviceDto.serviceTypeId,
    );
    const category = await this.categoryService.getCategoryById(
      serviceDto.categoryId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      serviceDto.manufacturerId,
    );
    const supplier = await this.supplierService.getSupplierById(
      serviceDto.supplierId,
    );
    let updated = Object.assign(toUpdate, rest);
    updated.status = status;
    updated.service_type = serviceType;
    updated.category = category;
    updated.manufacturer = manufacturer;
    updated.supplier = supplier;
    await this.serviceRepo.save(updated);
    
    await this.servicePriceRepo
      .createQueryBuilder()
      .update(ServicePrice)
      .set({ unit: updated.unit })
      .where("serviceId = :sid", { sid: updated.id })
      .execute();

    await this.handleCronServiceExpiration();
    return updated;
  }

  async deleteService(id: number) {
    await this.notificationService.deleteNotification(
      NotificationType.SERVICE,
      id,
    );
    const toRemove = await this.serviceRepo.findOneOrFail({
      where: { id },
      relations: { serviceToUsers: true },
    });
    return await this.serviceRepo.softRemove(toRemove);
  }

  async getServiceById(id: number) {
    const service: Service = await this.serviceRepo.findOneBy({ id });
    return service;
  }

  async saveServiceAfterInventory(id: number, statusId: number, newCost: number) {
    const service = await this.serviceRepo.findOneBy({ id });
    const status = await this.statusService.getStatusById(statusId);
    service.status = status;
    service.current_cost = newCost;
    await this.serviceRepo.save(service);
  }

  /*----------------------------- price service ----------------------------- */

  async createServicePrice(dto: ServicePriceDto) {
    const service = await this.serviceRepo.findOneBy({ id: dto.serviceId });
    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    const existingPrices: ServicePrice[] = await this.servicePriceRepo.find({
      where: { service: { id: dto.serviceId } },
      withDeleted: false,
    });

    const newPurchaseDate = dayjs(dto.purchase_date);

    for (const p of existingPrices) {
      const existingExp = dayjs(p.expiration_date);
      if (newPurchaseDate.isBefore(existingExp, 'day')) {
        const formattedNew = newPurchaseDate.format('YYYY-MM-DD');
        const formattedExistExp = existingExp.format('YYYY-MM-DD');

        throw new HttpException(
          `New purchase_date (${formattedNew}) cannot be before existing expiration_date (${formattedExistExp}).`,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    const price = new ServicePrice();
    price.service = service;
    price.purchase_cost   = dto.purchase_cost;
    price.purchase_date   = dto.purchase_date;
    price.expiration_date = dto.expiration_date;
    price.pricing_model   = dto.pricing_model;
    price.unit            = service.unit;
    price.unit_price      = dto.unit_price;
    price.description     = dto.description;

    return this.servicePriceRepo.save(price);
  }


  async getServicePrices(serviceId: number) {
    await this.getServiceById(serviceId);
    return this.servicePriceRepo.find({
      where: { service: { id: serviceId } },
      withDeleted: false,
    });
  }

  async updateServicePrice(dto: ServicePriceDto) {
    const price = await this.servicePriceRepo.findOne({
      where: { id: dto.servicePriceId },
      relations: ['service'],
    });
    if (!price) {
      throw new HttpException('Service price not found', HttpStatus.NOT_FOUND);
    }

    const serviceId = price.service.id;
    const otherPrices: ServicePrice[] = await this.servicePriceRepo.find({
      where: {
        service: { id: serviceId },
        id: Not(dto.servicePriceId),
      },
      withDeleted: false,
    });

    const incomingPurchaseDate = dto.purchase_date
      ? dayjs(dto.purchase_date)
      : dayjs(price.purchase_date);

    for (const other of otherPrices) {
      const otherExp = dayjs(other.expiration_date);
      if (incomingPurchaseDate.isBefore(otherExp, 'day')) {
        const formattedIncoming = incomingPurchaseDate.format('YYYY-MM-DD');
        const formattedOtherExp = otherExp.format('YYYY-MM-DD');

        throw new HttpException(
          `Updated purchase_date (${formattedIncoming}) cannot be before existing expiration_date (${formattedOtherExp}).`,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    price.purchase_cost   = dto.purchase_cost   ?? price.purchase_cost;
    price.purchase_date   = dto.purchase_date   ?? price.purchase_date;
    price.expiration_date = dto.expiration_date ?? price.expiration_date;
    price.pricing_model   = dto.pricing_model   ?? price.pricing_model;
    price.unit_price      = dto.unit_price      ?? price.unit_price;
    price.description     = dto.description     ?? price.description;

    return this.servicePriceRepo.save(price);
  }


  async deleteServicePrice(servicePriceId: number) {
    const price = await this.servicePriceRepo.findOneBy({ id: servicePriceId });
    if (!price) {
      throw new HttpException('Service price not found', HttpStatus.NOT_FOUND);
    }
    await this.servicePriceRepo.softRemove(price);
    return price;
  }

  async getServicePriceById(servicePriceId: number) {
    const price = await this.servicePriceRepo.findOne({
      where: { id: servicePriceId },
      relations: { service: true },
    });
    if (!price) {
      throw new HttpException(
        `Service price with ID ${servicePriceId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return price;
  }



  /*------------------------ checkin/checkout service ------------------------- */

  async checkoutService(checkoutServiceDto: CheckoutServiceDto) {
    const service = await this.serviceRepo.findOne({
      relations: { serviceToUsers: true },
      where: { id: checkoutServiceDto.serviceId },
    });
    if (
      await this.serviceToUserRepo.findOne({
        where: {
          user: { id: checkoutServiceDto.userId },
          service: { id: checkoutServiceDto.serviceId },
        },
      })
    )
      throw new HttpException(
        'This user is already checkout',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.userService.getUserById(
      checkoutServiceDto.userId,
    );
    const serviceToUser = new ServiceToUser();
    serviceToUser.user = user;
    serviceToUser.service = service;
    serviceToUser.checkout_date = checkoutServiceDto.checkout_date;
    serviceToUser.checkout_note = checkoutServiceDto.checkout_note;
    await this.serviceToUserRepo.save(serviceToUser);
    return serviceToUser;
  }

  async checkinService(checkinServiceDto: CheckinServiceDto) {
    const serviceToUser = await this.serviceToUserRepo.findOneBy({
      id: checkinServiceDto.serviceToUserId,
    });
    serviceToUser.checkin_date = checkinServiceDto.checkin_date;
    serviceToUser.checkin_note = checkinServiceDto.checkin_note;
    await this.serviceToUserRepo.save(serviceToUser);
    await this.serviceToUserRepo.softDelete({
      id: checkinServiceDto.serviceToUserId,
    });
    return serviceToUser;
  }

  /*------------------------ cron ------------------------- */

  // At 00:00 everyday
  @Cron('0 0 * * *')
  async handleCronServiceExpiration() {
    const services: Service[] = await this.serviceRepo.find({
      relations: { servicePrices: true },
    });

    await Promise.all(
      services.map(async (svc: Service) => {
        const prices: ServicePrice[] = svc.servicePrices;
        const validPrices = prices.filter(p => p.expiration_date != null);

        if (validPrices.length === 0) {
          await this.notificationService.deleteNotification(
            NotificationType.SERVICE,
            svc.id,
          );
          return;
        }

        const latestExpiration = validPrices.reduce((maxSoFar, p) => {
          return p.expiration_date > maxSoFar ? p.expiration_date : maxSoFar;
        }, validPrices[0].expiration_date);

        const daysLeft = dayjs(latestExpiration).diff(dayjs(), 'day');

        await this.notificationService.deleteNotification(
          NotificationType.SERVICE,
          svc.id,
        );

        if (daysLeft <= 30) {
          await this.notificationService.createNewNotification({
            itemId: svc.id,
            expiration_date: latestExpiration,
            type: NotificationType.SERVICE,
          });
        }
      }),
    );
  }

  async getServicesByCategory(categoryId: number) {
    const services = await this.serviceRepo.find({
      relations: {
        service_type: true,
        category: true,
        manufacturer: true,
        supplier: true,
        serviceToUsers: true,
      },
      where: {
        category: { id: categoryId },
      },
    });

    return services.map(service => {
      const { service_type, category, manufacturer, supplier, serviceToUsers, ...rest } = service;
      return {
        ...rest,
        service_type: service_type?.name,
        category:     category?.name,
        manufacturer: manufacturer?.name,
        supplier:     supplier?.name,
      };
    });
  }
  
  async getAllRequestServices() {
      const requestService = await this.requestServiceRepo.find({
        relations: { category: true, user: true },
      });
      const res = requestService.map((r: RequestService) => {
        const { category, user, ...rest } = r;
        return {
          ...rest,
          category: category.name,
          categoryId: category.id,
          name: user.name,
          username: user.username,
        };
      });
      return res;
    }
    
    async acceptRequest(id: number, serviceId: number) {
      const request = await this.requestServiceRepo.findOne({
        where: { id },
        relations: { user: true },
      });
      if (request.status !== RequestServiceStatus.REQUESTED)
        throw new HttpException(
          'This request was accepted/rejected',
          HttpStatus.BAD_REQUEST,
        );
      
      request.status = RequestServiceStatus.ACCEPTED;
      request.serviceId = serviceId;
      await this.requestServiceRepo.save(request);
      const serviceToUser = new ServiceToUser();
      const user = await this.userService.getUserById(request.user.id);
      const service = await this.getServiceById(serviceId);
      serviceToUser.user = user;
      serviceToUser.service = service;
      serviceToUser.checkout_date = dayjs().toDate();
      await this.serviceToUserRepo.save(serviceToUser);
      await this.mailService.sendUserAcceptRequestService(user, service);
      return request;
    }
  
    async rejectRequest(id: number) {
      const request = await this.requestServiceRepo.findOne({
        where: { id },
        relations: { user: true },
      });
      const user = await this.userService.getUserById(request.user.id);
      if (request.status !== RequestServiceStatus.REQUESTED)
        throw new HttpException(
          'This request was accepted/rejected',
          HttpStatus.BAD_REQUEST,
        );
      request.status = RequestServiceStatus.REJECTED;
      await this.requestServiceRepo.save(request);
      await this.mailService.sendUserRejectRequest(user);
      return request;
    }
  
    /*------------------------ cron ------------------------- */
  
  
  
    /*------------------------ user ------------------------- */
  
    
  
    async getServiceRequestedByUser(id: number) {
      const requestService = await this.requestServiceRepo.find({
        where: { user: { id } },
        relations: { category: true },
      });
      const res = requestService.map((r: RequestService) => {
        const { category, ...rest } = r;
        return { ...rest, category: category.name };
      });
      return res;
    }
  
    async createNewRequestService(userId: number, newRequest: NewRequestService) {
      const newRequestService = new RequestService();
  
      const user = await this.userService.getUserById(userId);
      const admins = await this.adminService.getAllAdmins();
      const category = await this.categoryService.getCategoryById(
        newRequest.categoryId,
      );
      if (!category)
        throw new HttpException('Category not exist', HttpStatus.BAD_REQUEST);
      newRequestService.user = user;
      newRequestService.category = category;
      newRequestService.note = newRequest.note;
      await this.requestServiceRepo.save(newRequestService);
      await Promise.all(
        admins.map(async (admin) => {
          await this.mailService.sendAdminRequestService(user, admin);
        }),
      );
      return newRequestService;
    }

    async getServiceToUserByUser(userId: number) {
    const serviceToUsers = await this.serviceToUserRepo.find({
      where: { user: { id: userId } },
      relations: { service: true, user: true },
    });
    const res = await Promise.all(
      serviceToUsers.map(async (serviceToUser) => {
        const serviceId = serviceToUser.service.id;
        const service = await this.serviceRepo.findOne({
          where: {
            id: serviceId,
          },
          relations: {
            status: true,
            supplier: true,
          },
        });
        return {
          ...serviceToUser.service,
          status: service?.status?.name,
          statusColor: service?.status?.color,
          service_type: service?.service_type?.name,
          supplier: service?.supplier?.name,
        };
      }),
    );
    return res;
  }
}
