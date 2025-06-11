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
import License from 'src/models/entities/license.entity';
import { LicenseRepository } from 'src/models/repositories/license.repository';
import { CategoryService } from '../category/category.service';
import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { SupplierService } from '../supplier/supplier.service';
import { LicenseDto } from './dtos/license.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/notification.constants';
import { LicenseQueryDto } from './dtos/licenseQuery.dto';
import { CheckoutLicenseDto } from './dtos/checkoutLicense.dto';
import { CheckinLicenseDto } from './dtos/checkinLicense.dto';
import LicenseToAsset from 'src/models/entities/licenseToAsset.entity';
import { AssetService } from '../asset/asset.service';
import { LicenseToAssetRepository } from 'src/models/repositories/licenseToAsset.repository';
import { LicenseToAssetQueryDto } from './dtos/licenseToAsset.dto';
import { RequestLicense } from 'src/models/entities/requestLicense.entity';
import { RequestLicenseRepository } from 'src/models/repositories/requestLicense.repository';
import { RequestLicenseStatus } from './license.constant';
import { NewRequestLicense } from './dtos/new-request-license.dto';
import { UsersService } from '../users/users.service';
import { AdminService } from '../admin/admin.service';
import { MailService } from '../mail/mail.service';
import { StatusService } from '../status/status.service';
@Injectable()
export class LicenseService {
  private logger = new Logger(LicenseService.name);

  constructor(
    @InjectRepository(License)
    private licenseRepo: LicenseRepository,
    @InjectRepository(LicenseToAsset)
    private licenseToAssetRepo: LicenseToAssetRepository,
    @InjectRepository(RequestLicense)
    private requestLicenseRepo: RequestLicenseRepository,
    private assetService: AssetService,
    private categoryService: CategoryService,
    private statusService: StatusService,
    private manufacturerService: ManufacturerService,
    private supplierService: SupplierService,
    private userService: UsersService,
    private adminService: AdminService,
    private mailService: MailService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async getAll(licenseQuery?: LicenseQueryDto) {
    const licenses = await this.licenseRepo.find({
      relations: {
        status: true,
        category: true,
        manufacturer: true,
        supplier: true,
        licenseToAssets: true,
      },
      where: {
        status: { id: licenseQuery.statusId },
        category: { id: licenseQuery.categoryId },
        manufacturer: { id: licenseQuery.manufacturerId },
        supplier: { id: licenseQuery.supplierId },
      },
    });
    const res = licenses.map((license) => {
      const { status, category, manufacturer, supplier, licenseToAssets, ...rest } =
        license;
      return {
        ...rest,
        status: license?.status?.name,
        statusColor: license?.status?.color,
        category: license?.category?.name,
        manufacturer: license?.manufacturer?.name,
        supplier: license?.supplier?.name,
        available: license.seats - licenseToAssets?.length,
      };
    });
    return res;
  }

  async getLicenseByLicenseId(id: number) {
    const license: License = await this.licenseRepo.findOne({
      where: { id },
      relations: {
        status: true,
        category: true,
        manufacturer: true,
        supplier: true,
        licenseToAssets: true,
      },
    });
    const { status, category, manufacturer, supplier, licenseToAssets, ...rest } =
      license;
    return {
      ...rest,
      status: license?.status?.name,
      statusColor: license?.status?.color,
      category: license?.category?.name,
      manufacturer: license?.manufacturer?.name,
      supplier: license?.supplier?.name,
      available: license.seats - licenseToAssets?.length,
    };
  }

  async getLicenseToAsset(licenseToAssetQueryDto?: LicenseToAssetQueryDto) {
    const licenseToAssets = await this.licenseToAssetRepo.find({
      relations: {
        asset: true,
        license: true,
      },
      where: {
        asset: { id: licenseToAssetQueryDto.assetId },
        license: { id: licenseToAssetQueryDto.licenseId },
      },
      withDeleted: licenseToAssetQueryDto.withDeleted,
    });
    const res = licenseToAssets.map((licenseToAsset) => {
      const { asset, license, ...rest } = licenseToAsset;
      return {
        ...rest,
        assetId: asset?.id,
        assetName: asset?.name,
        licenseId: license?.id,
        licenseName: license?.name,
      };
    });
    return res;
  }

  async createNewLicense(licenseDto: LicenseDto) {
    const category = await this.categoryService.getCategoryById(
      licenseDto.categoryId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      licenseDto.manufacturerId,
    );
    const supplier = await this.supplierService.getSupplierById(
      licenseDto.supplierId,
    );
    const status = await this.statusService.getStatusById(
      licenseDto.statusId,
    );

    const license = new License();
    license.name = licenseDto.name;
    license.key = licenseDto.key;
    license.version = licenseDto.version;
    license.license_link = licenseDto.license_link;
    license.description = licenseDto.description;
    license.type = licenseDto.type;
    license.purchase_cost = licenseDto.purchase_cost;
    license.purchase_date = licenseDto.purchase_date;
    license.expiration_date = licenseDto.expiration_date;
    license.seats = licenseDto.seats;
    license.status = status;
    license.category = category;
    license.manufacturer = manufacturer;
    license.supplier = supplier;

    await this.licenseRepo.save(license);
    await this.handleCronLicenseExpiration();
    return license;
  }

  async updateLicense(id: number, licenseDto: LicenseDto) {
    let toUpdate = await this.licenseRepo.findOneBy({ id });
    let { statusId, categoryId, manufacturerId, supplierId, ...rest } = licenseDto;
    const category = await this.categoryService.getCategoryById(
      licenseDto.categoryId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      licenseDto.manufacturerId,
    );
    const supplier = await this.supplierService.getSupplierById(
      licenseDto.supplierId,
    );
    const status = await this.statusService.getStatusById(
      licenseDto.statusId,
    );
    let updated = Object.assign(toUpdate, rest);
    updated.status = status;
    updated.category = category;
    updated.manufacturer = manufacturer;
    updated.supplier = supplier;
    await this.licenseRepo.save(updated);
    await this.handleCronLicenseExpiration();
    return updated;
  }

  async deleteLicense(id: number) {
    await this.notificationService.deleteNotification(
      NotificationType.LICENSE,
      id,
    );
    const toRemove = await this.licenseRepo.findOneOrFail({
      where: { id },
      relations: { licenseToAssets: true },
    });
    return await this.licenseRepo.softRemove(toRemove);
  }

  async getLicenseById(id: number) {
    const license: License = await this.licenseRepo.findOneBy({ id });
    return license;
  }

  /*------------------------ checkin/checkout license ------------------------- */

  async checkoutLicense(checkoutLicenseDto: CheckoutLicenseDto) {
    const license = await this.licenseRepo.findOne({
      relations: { licenseToAssets: true },
      where: { id: checkoutLicenseDto.licenseId },
    });
    if (license.licenseToAssets.length >= license.seats)
      throw new HttpException('This license is full', HttpStatus.BAD_REQUEST);
    if (
      await this.licenseToAssetRepo.findOne({
        where: {
          asset: { id: checkoutLicenseDto.assetId },
          license: { id: checkoutLicenseDto.licenseId },
        },
      })
    )
      throw new HttpException(
        'This asset is already checkout',
        HttpStatus.BAD_REQUEST,
      );
    const asset = await this.assetService.getAssetById(
      checkoutLicenseDto.assetId,
    );
    const licenseToAsset = new LicenseToAsset();
    licenseToAsset.asset = asset;
    licenseToAsset.license = license;
    licenseToAsset.checkout_date = checkoutLicenseDto.checkout_date;
    licenseToAsset.checkout_note = checkoutLicenseDto.checkout_note;
    await this.licenseToAssetRepo.save(licenseToAsset);
    return licenseToAsset;
  }

  async checkinLicense(checkinLicenseDto: CheckinLicenseDto) {
    const licenseToAsset = await this.licenseToAssetRepo.findOneBy({
      id: checkinLicenseDto.licenseToAssetId,
    });
    licenseToAsset.checkin_date = checkinLicenseDto.checkin_date;
    licenseToAsset.checkin_note = checkinLicenseDto.checkin_note;
    await this.licenseToAssetRepo.save(licenseToAsset);
    await this.licenseToAssetRepo.softDelete({
      id: checkinLicenseDto.licenseToAssetId,
    });
    return licenseToAsset;
  }

  async saveLicenseAfterInventory(id: number,  statusId: number, newCost: number) {
    const license = await this.licenseRepo.findOneBy({ id });
    const status = await this.statusService.getStatusById(statusId);
    license.status = status;
    license.current_cost = newCost;
    await this.licenseRepo.save(license);
  }

  /*------------------------ cron ------------------------- */

  // At 00:00 everyday
  @Cron('0 0 * * *')
  async handleCronLicenseExpiration() {
    const licenses: License[] = await this.licenseRepo.find();
    await Promise.all(
      licenses.map(async (license: License) => {
        const expiration_date = license.expiration_date;
        const date1 = dayjs(expiration_date);
        const date2 = dayjs();
        let diff = date1.diff(date2, 'day');
        await this.notificationService.deleteNotification(
          NotificationType.LICENSE,
          license.id,
        );
        if (diff <= 30) {
          await this.notificationService.createNewNotification({
            itemId: license.id,
            expiration_date: license.expiration_date,
            type: NotificationType.LICENSE,
          });
        }
      }),
    );
  }


  async getAllRequestLicenses() {
    const reqs = await this.requestLicenseRepo.find({
      relations: { category: true, user: true },
    });
    return reqs.map(r => {
      const { category, user, ...rest } = r;
      return {
        ...rest,
        category:   category.name,
        categoryId: category.id,
        name:       user.name,
        username:   user.username,
      };
    });
  }

  async acceptRequest(requestId: number, licenseId: number, assetId: number) {
    const req = await this.requestLicenseRepo.findOne({
      where: { id: requestId },
      relations: ['user'],
    });
    if (!req || req.status !== RequestLicenseStatus.REQUESTED) {
      throw new HttpException(
        'This request was already processed',
        HttpStatus.BAD_REQUEST,
      );
    }
    const license = await this.getLicenseById(licenseId);
    const asset   = await this.assetService.getAssetById(assetId);

    const activeAssignments = await this.licenseToAssetRepo.count({
      where: { license: { id: licenseId }, deletedAt: null },
    });
    if (activeAssignments >= license.seats) {
      throw new HttpException('No available seats on this license', HttpStatus.BAD_REQUEST);
    }

    const already = await this.licenseToAssetRepo.findOne({
      where: { license: { id: licenseId }, asset: { id: assetId } },
    });
    if (already) {
      throw new HttpException('This license is already assigned to that asset', HttpStatus.BAD_REQUEST);
    }

    req.status    = RequestLicenseStatus.ACCEPTED;
    req.licenseId = licenseId;
    req.assetId   = assetId;
    await this.requestLicenseRepo.save(req);

    const l2a = new LicenseToAsset();
    l2a.license       = license;
    l2a.asset         = asset;
    l2a.checkout_date = dayjs().toDate();
    l2a.checkout_note = req.note;      
    await this.licenseToAssetRepo.save(l2a);

    await this.mailService.sendUserAcceptRequestLicense(req.user, license);
    return req;
  }

  async rejectRequest(requestId: number) {
    const req = await this.requestLicenseRepo.findOne({
      where: { id: requestId },
      relations: ['user'],
    });
    if (!req || req.status !== RequestLicenseStatus.REQUESTED) {
      throw new HttpException(
        'This request was already processed',
        HttpStatus.BAD_REQUEST,
      );
    }

    req.status = RequestLicenseStatus.REJECTED;
    await this.requestLicenseRepo.save(req);
    await this.mailService.sendUserRejectRequestLicense(req.user);
    return req;
  }

  async getLicensesOnUserAssets(userId: number) {
    const assets = await this.assetService.getAssetToUser(userId);
    const assignments = await this.licenseToAssetRepo.find({
      where: assets.map(a => ({ asset: { id: a.id } })),
      relations: ['license', 'asset'],
    });
    return assignments.map(a => ({
      assetName:     a.asset.name,
      licenseName:   a.license.name,
      checkoutDate:  a.checkout_date,
      checkinDate:   a.checkin_date,
    }));
  }

  async getLicenseRequestsByUser(userId: number) {
    const reqs = await this.requestLicenseRepo.find({
      where: { user: { id: userId } },
      relations: { category: true },
    });
    return reqs.map(r => ({
      id:        r.id,
      date:      r.date,
      status:    r.status,
      category:  r.category.name,
      licenseId: r.licenseId,
      assetId:   r.assetId,
      note:      r.note,
    }));
  }

  async createNewRequestLicense(userId: number, dto: NewRequestLicense) {
    const user     = await this.userService.getUserById(userId);
    const admins   = await this.adminService.getAllAdmins();
    const category = await this.categoryService.getCategoryById(dto.categoryId);

    if (!category) {
      throw new HttpException('Category does not exist', HttpStatus.BAD_REQUEST);
    }

    const req = this.requestLicenseRepo.create({
      user,
      category,
      note:      dto.note,
      assetId:   dto.assetId,
      licenseId: null,
    });
    await this.requestLicenseRepo.save(req);

    await Promise.all(
      admins.map(admin =>
        this.mailService.sendAdminRequestLicense(user, admin),
      ),
    );

    return req;
  }

  async getLicensesByCategory(categoryId: number) {
    const licenses = await this.licenseRepo.find({
      relations: {
        category: true,
        manufacturer: true,
        supplier: true,
        licenseToAssets: true,
      },
      where: {
        category: { id: categoryId },
      },
    });

    return licenses.map(license => {
      const { category, manufacturer, supplier, licenseToAssets, ...rest } = license;
      return {
        ...rest,
        category:     category?.name,
        manufacturer: manufacturer?.name,
        supplier:     supplier?.name,
        available:    license.seats - (licenseToAssets?.length || 0),
      };
    });
  }
}

