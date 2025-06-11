import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import Asset from 'src/models/entities/asset.entity';
import AssetToInventory from 'src/models/entities/assetToInventory.entity';
import Inventory from 'src/models/entities/inventory.entity';
import { AssetToInventoryRepository } from 'src/models/repositories/assetToInventory.repository';
import { InventoryRepository } from 'src/models/repositories/inventory.repository';
import { AssetService } from '../asset/asset.service';
import { DepartmentService } from '../department/department.service';
import { StatusService } from '../status/status.service';
import { InventoryDto } from './dtos/inventory.dto';
import { UpdateAssetToInventoryDto } from './dtos/update-asset-to-inventory.dto';
import { LicenseToAssetRepository } from 'src/models/repositories/licenseToAsset.repository';
import LicenseToInventory from 'src/models/entities/licenseToInventory.entity';
import { LicenseToInventoryRepository } from 'src/models/repositories/licenseToInventory.repository';
import { UpdateLicenseToInventoryDto } from './dtos/update-license-to-inventory.dto';
import { LicenseService } from '../license/license.service';
import { UsersService } from '../users/users.service';
import { ServiceToInventoryRepository } from 'src/models/repositories/serviceToInventory.repository';
import { ServiceToUserRepository } from 'src/models/repositories/serviceToUser.repository';
import ServiceToInventory from 'src/models/entities/serviceToInventory.entity';
import { UpdateServiceToInventoryDto } from './dtos/update-service-to-inventory.dto';
import { ServiceService } from '../service/service.service';
import LicenseToAsset from 'src/models/entities/licenseToAsset.entity';
import ServiceToUser from 'src/models/entities/serviceToUser.entity';
import { LicenseRepository } from 'src/models/repositories/license.repository';
import { ServiceRepository } from 'src/models/repositories/service.repository';
import License from 'src/models/entities/license.entity';
import Service from 'src/models/entities/service.entity';
import { DeprecationRepository } from 'src/models/repositories/deprecation.repository';
import Deprecation from 'src/models/entities/deprecation.entity';
import ServiceUsage from 'src/models/entities/serviceUsage.entity';
import ServicePrice from 'src/models/entities/servicePrice.entity';
import { ServicePriceRepository } from 'src/models/repositories/servicePrice.repository';
import { ServiceUsageRepository } from 'src/models/repositories/serviceUsage.repository';

@Injectable()
export class InventoryService {
  private logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Inventory)
    private inventoryRepo: InventoryRepository,
    @InjectRepository(AssetToInventory)
    private assetToInventoryRepo: AssetToInventoryRepository,
    @InjectRepository(LicenseToInventory)
    private licenseToInventoryRepo: LicenseToInventoryRepository,
    @InjectRepository(LicenseToAsset)
    private licenseToAssetRepo: LicenseToAssetRepository,
    @InjectRepository(ServiceToInventory)
    private serviceToInventoryRepo: ServiceToInventoryRepository,
    @InjectRepository(ServiceToUser)
    private serviceToUserRepo: ServiceToUserRepository,
    @InjectRepository(License)
    private licenseRepo: LicenseRepository,
    @InjectRepository(Service)
    private serviceRepo: ServiceRepository,
    @InjectRepository(ServicePrice)
    private servicePriceRepo: ServicePriceRepository,
    @InjectRepository(ServiceUsage)
    private serviceUsageRepo: ServiceUsageRepository,
    @InjectRepository(Deprecation)
    private deprecationRepo: DeprecationRepository,
    private assetService: AssetService,
    private licenseService: LicenseService,
    private serviceService: ServiceService,
    private userService: UsersService,
    private departmentService: DepartmentService,
    private statusService: StatusService,
  ) {}

  async getAllInventories() {
    const inventories = await this.inventoryRepo.find({
      relations: { department: true, assetToInventories: true, licenseToInventories: true, serviceToInventories: true },
    });
    const res = inventories.map((inventory) => {
      const { department, assetToInventories, licenseToInventories, serviceToInventories, ...rest } = inventory;
      return {
        ...rest,
        department: department.name,
        assets: assetToInventories?.length ?? 0,
        licenses: licenseToInventories?.length ?? 0,
        services: serviceToInventories?.length ?? 0,
        remaining: assetToInventories.filter(
          (assetToInventory) => assetToInventory.check === false,
        ).length,
        remainingl: licenseToInventories.filter(
          (licenseToInventory) => licenseToInventory.check === false,
        ).length,
        remainings: serviceToInventories.filter(
          (serviceToInventory) => serviceToInventory.check === false,
        ).length,
      };
    });
    return res;
  }

  async getInventoryById(id: number) {
    const inventory = this.inventoryRepo.findOne({
      where: { id },
      relations: { department: true },
    });
    return inventory;
  }

  async createInventory(inventoryDto: InventoryDto) {
    const department = await this.departmentService.getDepartmentById(
      inventoryDto.departmentId,
    );

    const existingInventories: Inventory[] = await this.inventoryRepo.find({
      where: { department: { id: inventoryDto.departmentId } },
    });
    if (existingInventories.some(inv => !inv.done)) {
      throw new HttpException(
        `Cannot create new inventory: there is still an unfinished inventory for department "${department.name}".`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let maxDate: Date | null = null;
    for (const inv of existingInventories) {
      const candidateDate: Date = inv.end_date
        ? new Date(inv.end_date)
        : new Date(inv.start_date);
      if (!maxDate || candidateDate.getTime() > maxDate.getTime()) {
        maxDate = candidateDate;
      }
    }

    const newStartDate = new Date(inventoryDto.start_date);
    if (maxDate && newStartDate.getTime() <= maxDate.getTime()) {
      throw new HttpException(
        `Invalid start_date: must be later than ${maxDate.toISOString().slice(0, 10)}.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const inventory = new Inventory();
    inventory.name = inventoryDto.name;
    inventory.department = department;
    inventory.start_date = inventoryDto.start_date;
    inventory.end_date = inventoryDto.end_date;
    inventory.note = inventoryDto.note;
    inventory.done = inventoryDto.done;
    await this.inventoryRepo.save(inventory);

    const assets: Asset[] = await this.assetService.getAssetsByDepartmentId(
      inventoryDto.departmentId,
    );

    const categoryIds = Array.from(
      new Set(
        assets
          .map(a => a.assetModel?.category?.id)
          .filter((cid): cid is number => cid != null),
      ),
    );

    const depreciationRules: Deprecation[] = await this.deprecationRepo.find({
      where: { category: { id: In(categoryIds) } },
      relations: ['category'],
    });
    const catToMonths = new Map<number, number>();
    depreciationRules.forEach(rule => {
      catToMonths.set(rule.category.id, rule.months);
    });

    await Promise.all(
      assets.map(async (asset: Asset) => {
        const ai = new AssetToInventory();
        ai.inventory = inventory;
        ai.asset = asset;
        ai.old_cost = asset.current_cost;
        ai.new_cost = asset.current_cost;
        ai.old_status = asset.status;
        ai.new_status = asset.status;

        const category = asset.assetModel?.category;
        if (category && catToMonths.has(category.id)) {
          const months = catToMonths.get(category.id)!;
          const purchaseDate = new Date(asset.purchase_date);
          const refDate = new Date(inventoryDto.start_date);
          const ageMonths =
            (refDate.getFullYear() - purchaseDate.getFullYear()) * 12 +
            (refDate.getMonth() - purchaseDate.getMonth());
          let estimated = 0;
          if (ageMonths >= months) {
            estimated = 0;
          } else {
            const factor = 1 - ageMonths / months;
            estimated =
              Math.round((asset.purchase_cost ?? 0) * factor);
          }
          ai['estimated_cost'] = estimated;
        } else {
          ai['estimated_cost'] = asset.current_cost ?? 0;
        }

        await this.assetToInventoryRepo.save(ai);
      }),
    );

    const licenseToAssets = await this.licenseToAssetRepo.find({
      relations: ['asset', 'license'],
      where: {
        asset: { department: { id: inventoryDto.departmentId } },
      },
    });
    const seenLicenses = new Set<number>();
    await Promise.all(
      licenseToAssets.map(async l2a => {
        const licEntity = l2a.license;
        if (seenLicenses.has(licEntity.id)) return;
        seenLicenses.add(licEntity.id);

        const lic = await this.licenseRepo.findOne({
          where: { id: licEntity.id },
          relations: ['status'],
        });
        const li = new LicenseToInventory();
        li.inventory = inventory;
        li.license = lic;
        li.old_cost = lic.current_cost ?? lic.purchase_cost;
        li.new_cost = lic.current_cost ?? lic.purchase_cost;
        li.old_status = lic.status;
        li.new_status = lic.status;
        li.check = false;

        const now = new Date(inventoryDto.start_date);
        let estimated = 0;
        if (lic.expiration_date) {
          const purchaseDate = new Date(lic.purchase_date);
          const expirationDate = new Date(lic.expiration_date);
          const totalMonths =
            (expirationDate.getFullYear() - purchaseDate.getFullYear()) * 12 +
            (expirationDate.getMonth() - purchaseDate.getMonth());
          const monthsLeft =
            (expirationDate.getFullYear() - now.getFullYear()) * 12 +
            (expirationDate.getMonth() - now.getMonth());
          if (totalMonths > 0 && monthsLeft > 0) {
            estimated =
              Math.round((lic.purchase_cost ?? 0) * (monthsLeft / totalMonths));
          } else {
            estimated = 0;
          }
        } else {
          estimated = lic.current_cost ?? lic.purchase_cost ?? 0;
        }
        li['estimated_cost'] = estimated;

        await this.licenseToInventoryRepo.save(li);
      }),
    );

    const users = await this.userService.getUsersByDepartmentId(
      inventoryDto.departmentId,
    );

    const allMaps = await this.serviceToUserRepo.find({
      relations: ['user', 'service'],
      where: {
        user: { id: In(users.map((u) => u.id)) },
      },
    });

    const seenServices = new Set<number>();
    for (const map of allMaps) {
      const svcEntity = map.service;
      if (seenServices.has(svcEntity.id)) continue;
      seenServices.add(svcEntity.id);

      const svc = await this.serviceRepo.findOne({
        where: { id: svcEntity.id },
        relations: ['status'],
      });
      if (!svc) continue;

      const allUsages: ServiceUsage[] = await this.serviceUsageRepo.find({
        where: {
          service: { id: svc.id },
          usage_metric: svc.unit,
        },
      });

      const pricePeriods: ServicePrice[] = await this.servicePriceRepo.find({
        where: { service: { id: svc.id } },
        withDeleted: false,
      });

      if (pricePeriods.length === 0) {
        const si = new ServiceToInventory();
        si.inventory = inventory;
        si.service = svc;
        si.old_cost = svc.current_cost;
        si.new_cost = svc.current_cost;
        si.total_unit = null;
        si.estimated_cost = null;
        si.old_status = svc.status;
        si.new_status = svc.status;
        si.check = false;

        await this.serviceToInventoryRepo.save(si);
        continue;
      }

      let totalUnitsAllPeriods = 0;
      let totalCostAllPeriods = 0;

      for (const price of pricePeriods) {
        const startDate = price.purchase_date;
        const endDate = price.expiration_date;

        const usagesInPeriod = allUsages.filter((u) => {
          return u.record_at >= startDate && u.record_at <= endDate;
        });

        let periodUnits = 0;
        for (const u of usagesInPeriod) {
          const val = Number(u.usage_value ?? 0);
          if (!isNaN(val)) periodUnits += val;
        }

        const periodCost = periodUnits * (price.unit_price ?? 0);

        totalUnitsAllPeriods += periodUnits;
        totalCostAllPeriods += periodCost;
      }

      const si = new ServiceToInventory();
      si.inventory = inventory;
      si.service = svc;
      si.old_cost = svc.current_cost;
      si.new_cost = svc.current_cost;
      si.total_unit = totalUnitsAllPeriods;
      si.estimated_cost = totalCostAllPeriods;
      si.old_status = svc.status;
      si.new_status = svc.status;
      si.check = false;

      await this.serviceToInventoryRepo.save(si);
    }

    return inventory;
  }


  async updateInventory(id: number, inventoryDto: InventoryDto) {
    let toUpdate = await this.inventoryRepo.findOneBy({ id });
    toUpdate.name = inventoryDto?.name;
    toUpdate.start_date = inventoryDto?.start_date;
    toUpdate.note = inventoryDto?.note;
    toUpdate.end_date = inventoryDto?.end_date;
    toUpdate.done = inventoryDto?.done;
    await this.inventoryRepo.save(toUpdate);
    return toUpdate;
  }

  async getAssetToInventoryByInventoryId(id: number) {
    const assetToInventories: AssetToInventory[] =
      await this.assetToInventoryRepo.find({
        where: { inventory: { id } },
        relations: { asset: true, old_status: true, new_status: true },
        withDeleted: true,
      });
    const res = assetToInventories.map((assetToInventory) => {
      const { asset, old_status, new_status, ...rest } = assetToInventory;
      return {
        ...rest,
        asset_id: asset.id,
        asset_name: asset.name,
        purchase_date: asset.purchase_date,
        purchase_cost: asset.purchase_cost,
        old_status: old_status.name,
        new_status: new_status.name,
      };
    });
    return res;
  }

  async updateAssetToInventory(
    id: number,
    updateDto: UpdateAssetToInventoryDto,
  ) {
    if (
      String(updateDto?.new_cost) === '' ||
      isNaN(Number(updateDto?.new_cost)) ||
      updateDto?.new_cost < 0
    )
      throw new HttpException(
        `New cost of asset ${updateDto?.assetId} is invalid`,
        HttpStatus.BAD_REQUEST,
      );
    let toUpdate = await this.assetToInventoryRepo.findOneBy({ id });
    const status = await this.statusService.getStatusById(
      updateDto.newStatusId,
    );
    toUpdate.new_cost = updateDto?.new_cost;
    toUpdate.check = updateDto?.check;
    toUpdate.new_status = status;
    await this.assetToInventoryRepo.save(toUpdate);
    await this.assetService.saveAssetAfterInventory(
      updateDto.assetId,
      updateDto.newStatusId,
      updateDto.new_cost,
    );
    return toUpdate;
  }

  async getLicenseToInventoryByInventoryId(id: number) {
    const licenseToInventories: LicenseToInventory[] =
      await this.licenseToInventoryRepo.find({
        where: { inventory: { id } },
        relations: { license: true, old_status: true, new_status: true },
        withDeleted: true,
      });
    const res = licenseToInventories.map((licenseToInventory) => {
      const { license, old_status, new_status, ...rest } = licenseToInventory;
      return {
        ...rest,
        license_id: license.id,
        license_name: license.name,
        purchase_date: license.purchase_date,
        purchase_cost: license.purchase_cost,
        expiration_date: license.expiration_date,
        old_status: old_status?.name ?? '',
        new_status: new_status?.name ?? '',
      };
    });
    return res;
  }

  async updateLicenseToInventory(
    id: number,
    updateDto: UpdateLicenseToInventoryDto,
  ) {
    if (
      String(updateDto?.new_cost) === '' ||
      isNaN(Number(updateDto?.new_cost)) ||
      updateDto?.new_cost < 0
    )
      throw new HttpException(
        `New cost of license ${updateDto?.licenseId} is invalid`,
        HttpStatus.BAD_REQUEST,
      );
    let toUpdate = await this.licenseToInventoryRepo.findOneBy({ id });
    const status = await this.statusService.getStatusById(
      updateDto.newStatusId,
    );
    toUpdate.new_cost = updateDto?.new_cost;
    toUpdate.check = updateDto?.check;
    toUpdate.new_status = status;
    await this.licenseToInventoryRepo.save(toUpdate);
    await this.licenseService.saveLicenseAfterInventory(
      updateDto.licenseId,
      updateDto.newStatusId,
      updateDto.new_cost,
    );
    return toUpdate;
  }

  async getServiceToInventoryByInventoryId(id: number) {
    const serviceToInventories: ServiceToInventory[] =
      await this.serviceToInventoryRepo.find({
        where: { inventory: { id } },
        relations: { service: true, old_status: true, new_status: true },
        withDeleted: true,
      });
    const res = serviceToInventories.map((serviceToInventory) => {
      const { service, old_status, new_status, ...rest } = serviceToInventory;
      return {
        ...rest,
        service_id: service.id,
        service_name: service.name,
        unit: service.unit,
        old_status: old_status?.name ?? '',
        new_status: new_status?.name ?? '',
      };
    });
    return res;
  }

  async updateServiceToInventory(
    id: number,
    updateDto: UpdateServiceToInventoryDto,
  ) {
    if (
      String(updateDto?.new_cost) === '' ||
      isNaN(Number(updateDto?.new_cost)) ||
      updateDto?.new_cost < 0
    )
      throw new HttpException(
        `New cost of service ${updateDto?.serviceId} is invalid`,
        HttpStatus.BAD_REQUEST,
      );
    let toUpdate = await this.serviceToInventoryRepo.findOneBy({ id });
    const status = await this.statusService.getStatusById(
      updateDto.newStatusId,
    );
    toUpdate.new_cost = updateDto?.new_cost;
    toUpdate.check = updateDto?.check;
    toUpdate.new_status = status;
    await this.serviceToInventoryRepo.save(toUpdate);
    await this.serviceService.saveServiceAfterInventory(
      updateDto.serviceId,
      updateDto.newStatusId,
      updateDto.new_cost,
    );
    return toUpdate;
  }

}
