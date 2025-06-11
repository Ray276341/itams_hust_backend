import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import Asset from 'src/models/entities/asset.entity';
import AssetModel from 'src/models/entities/assetModel.entity';
import AssetToUser from 'src/models/entities/assetToUser.entity';
import { Category } from 'src/models/entities/category.entity';
import Deprecation from 'src/models/entities/deprecation.entity';
import { RequestAsset } from 'src/models/entities/requestAssest.entity';
import { AssetRepository } from 'src/models/repositories/asset.repository';
import { AssetToUserRepository } from 'src/models/repositories/assetToUser.repository';
import { RequestAssetRepository } from 'src/models/repositories/requestAsset.repository';
import { DataSource, In, IsNull, Not } from 'typeorm';
import { AdminService } from '../admin/admin.service';
import { AssetModelService } from '../assetModel/assetModel.service';
import { CategoryService } from '../category/category.service';
import { DepartmentService } from '../department/department.service';
import { DeprecationService } from '../deprecation/deprecation.service';
import { FirebaseService } from '../firebase/firebase.service';
import { MailService } from '../mail/mail.service';
import { NotificationType } from '../notification/notification.constants';
import { NotificationService } from '../notification/notification.service';
import { StatusService } from '../status/status.service';
import { SupplierService } from '../supplier/supplier.service';
import { UsersService } from '../users/users.service';
import { CheckType, IMAGE_PATH, RequestAssetStatus } from './asset.constants';
import { AssetDto } from './dtos/asset.dto';
import { AssetHistoryQueryDto } from './dtos/assetHistoryQuery.dto';
import { AssetQueryDto } from './dtos/assetQuery.dto';
import { CheckinAssetDto } from './dtos/checkinAsset.dto';
import { CheckoutAssetDto } from './dtos/checkoutAsset.dto';
import { NewRequestAsset } from './dtos/new-request-asset.dto';

@Injectable()
export class AssetService {
  private logger = new Logger(AssetService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Asset)
    private assetRepo: AssetRepository,
    @InjectRepository(AssetToUser)
    private assetToUserRepo: AssetToUserRepository,
    @InjectRepository(RequestAsset)
    private requestAssetRepo: RequestAssetRepository,
    private userService: UsersService,
    private adminService: AdminService,
    private assetModelService: AssetModelService,
    private departmentService: DepartmentService,
    private statusService: StatusService,
    private supplierService: SupplierService,
    private categoryService: CategoryService,
    private deprecationService: DeprecationService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    private mailService: MailService,
    private firebaseService: FirebaseService,
  ) {}

  async getAll(assetQuery?: AssetQueryDto) {
    const assets = await this.assetRepo.find({
      relations: {
        assetModel: true,
        department: true,
        status: true,
        supplier: true,
        assetToUsers: true,
      },
      where: {
        assetModel: { id: assetQuery.assetModelId },
        department: { id: assetQuery.departmentId },
        status: { id: assetQuery.statusId },
      },
    });
    return (
      await Promise.all(
        assets.map(async (asset) => {
          const {
            assetModel,
            department,
            status,
            supplier,
            assetToUsers,
            ...rest
          } = asset;
          const assetToUser = await this.assetToUserRepo.findOne({
            relations: { user: true },
            where: { asset: { id: asset.id } },
          });
          const user = assetToUser
            ? await this.userService.getUserById(assetToUser?.user?.id)
            : null;
          const res = {
            ...rest,
            assetModel: asset?.assetModel?.name,
            department: asset?.department?.name,
            status: asset?.status?.name,
            statusColor: asset?.status?.color,
            supplier: asset?.supplier?.name,
            username: assetToUser ? user?.name : null,
            user: user,
            check_type: assetToUser ? CheckType.CHECKIN : CheckType.CHECKOUT,
          };
          if (assetQuery.userId) {
            if (Number(user?.id) === Number(assetQuery?.userId)) return res;
            else return;
          }
          return res;
        }),
      )
    ).filter((item) => Boolean(item));
  }

  async getDeletedAssets() {
    const assets = await this.assetRepo.find({
      relations: {
        assetModel: true,
        department: true,
        status: true,
        supplier: true,
        assetToUsers: true,
      },
      where: {
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
    });
    return (
      await Promise.all(
        assets.map(async (asset) => {
          const {
            assetModel,
            department,
            status,
            supplier,
            assetToUsers,
            ...rest
          } = asset;
          const assetToUser = await this.assetToUserRepo.findOne({
            relations: { user: true },
            where: { asset: { id: asset.id } },
          });
          const user = assetToUser
            ? await this.userService.getUserById(assetToUser?.user?.id)
            : null;
          const res = {
            ...rest,
            assetModel: asset?.assetModel?.name,
            department: asset?.department?.name,
            status: asset?.status?.name,
            statusColor: asset?.status?.color,
            supplier: asset?.supplier?.name,
            username: assetToUser ? user?.name : null,
            user: user,
            check_type: assetToUser ? CheckType.CHECKIN : CheckType.CHECKOUT,
          };
          return res;
        }),
      )
    ).filter((item) => Boolean(item));
  }

  async getAssetHistory(assetHistoryQueryDto?: AssetHistoryQueryDto) {
    const assetToUsers: AssetToUser[] = await this.assetToUserRepo.find({
      relations: {
        asset: true,
        user: true,
      },
      where: {
        asset: { id: assetHistoryQueryDto.assetId },
        user: { id: assetHistoryQueryDto.userId },
      },
      withDeleted: true,
    });
    return Promise.all(
      assetToUsers.map((assetToUser: AssetToUser) => {
        const { asset, user, ...rest } = assetToUser;
        return {
          ...rest,
          assetId: asset?.id,
          assetName: asset?.name,
          userId: user?.id,
          userName: user?.name,
        };
      }),
    );
  }

  async getAssetByAssetId(id: number) {
    const asset: Asset = await this.assetRepo.findOne({
      where: { id },
      relations: {
        assetModel: true,
        department: true,
        status: true,
        supplier: true,
        assetToUsers: true,
      },
    });
    const { assetModel, assetToUsers, department, status, supplier, ...rest } =
      asset;
    const assetToUser = await this.assetToUserRepo.findOne({
      relations: { user: true },
      where: { asset: { id: asset.id } },
    });
    const user = assetToUser
      ? await this.userService.getUserById(assetToUser?.user?.id)
      : null;
    return {
      ...rest,
      assetModel: asset?.assetModel?.name,
      department: asset?.department?.name,
      status: asset?.status?.name,
      statusColor: asset?.status?.color,
      supplier: asset?.supplier?.name,
      username: assetToUser ? user?.name : null,
      user: user,
      check_type: assetToUser ? CheckType.CHECKIN : CheckType.CHECKOUT,
    };
  }

  async createNewAsset(assetDto: AssetDto) {
    const assetModel = await this.assetModelService.getAssetModelById(
      assetDto.assetModelId,
    );
    const department = await this.departmentService.getDepartmentById(
      assetDto.departmentId,
    );
    const status = await this.statusService.getStatusById(assetDto.statusId);
    const supplier = await this.supplierService.getSupplierById(
      assetDto.supplierId,
    );

    const asset = new Asset();
    asset.name = assetDto.name;
    asset.purchase_date = dayjs(assetDto.purchase_date).toDate();
    asset.purchase_cost = assetDto.purchase_cost;
    asset.assetModel = assetModel;
    asset.department = department;
    asset.status = status;
    asset.supplier = supplier;

    await this.assetRepo.save(asset);
    await this.handleCronAssetDeprecation();
    return asset;
  }

  async saveImage(id: number, file: Express.Multer.File) {
    // upload ảnh lên storage
    const image = await this.firebaseService.uploadFile(file, IMAGE_PATH);
    // cập nhật db
    return await this.assetRepo.update({ id }, { image });
  }

  async importAsset(assetDtos: AssetDto[]) {
    await this.dataSource.transaction(async (manager) => {
      await Promise.all(
        assetDtos.map(async (assetDto: AssetDto) => {
          const assetModel = await this.assetModelService.getAssetModelById(
            assetDto.assetModelId,
          );
          const department = await this.departmentService.getDepartmentById(
            assetDto.departmentId,
          );
          const status = await this.statusService.getStatusById(
            assetDto.statusId,
          );
          const supplier = await this.supplierService.getSupplierById(
            assetDto.supplierId,
          );

          const asset = new Asset();
          asset.name = assetDto.name;
          asset.purchase_date = dayjs(assetDto.purchase_date).toDate();
          asset.purchase_cost = assetDto.purchase_cost;
          asset.assetModel = assetModel;
          asset.department = department;
          asset.status = status;
          asset.supplier = supplier;

          await manager.save(asset);
        }),
      );
    });
    await this.handleCronAssetDeprecation();
    return assetDtos;
  }

  async updateAsset(id: number, assetDto: AssetDto) {
    let toUpdate = await this.assetRepo.findOneBy({ id });
    let { assetModelId, departmentId, statusId, supplierId, ...rest } =
      assetDto;
    const assetModel = await this.assetModelService.getAssetModelById(
      assetDto.assetModelId,
    );
    const department = await this.departmentService.getDepartmentById(
      assetDto.departmentId,
    );
    const status = await this.statusService.getStatusById(assetDto.statusId);
    const supplier = await this.supplierService.getSupplierById(
      assetDto.supplierId,
    );
    let updated = Object.assign(toUpdate, rest);
    updated.assetModel = assetModel;
    updated.department = department;
    updated.status = status;
    updated.supplier = supplier;
    await this.assetRepo.save(updated);
    await this.handleCronAssetDeprecation();
    return updated;
  }

  async deleteAsset(id: number) {
    try {
      await this.notificationService.deleteNotification(
        NotificationType.LICENSE,
        id,
      );
      const toRemove = await this.assetRepo.findOneOrFail({
        where: { id },
        relations: {
          assetToUsers: true,
          assetMaintenances: true,
          licenseToAssets: true,
        },
      });
      return await this.assetRepo.softRemove(toRemove);
    } catch (err) {
      throw new HttpException('Cannot delete', HttpStatus.BAD_REQUEST);
    }
  }

  /*------------------------ checkin/checkout asset ------------------------- */

  async checkoutAsset(checkoutAssetDto: CheckoutAssetDto) {
    const asset = await this.assetRepo.findOne({
      where: { id: checkoutAssetDto.assetId },
    });
    const user = await this.userService.getUserById(checkoutAssetDto.userId);
    const status = await this.statusService.getStatusById(
      checkoutAssetDto.statusId,
    );
    const department = await this.departmentService.getDepartmentByUserId(
      user.id,
    );
    asset.status = status;
    asset.department = department;
    const assetToUser = new AssetToUser();
    assetToUser.asset = asset;
    assetToUser.user = user;
    assetToUser.checkout_date = checkoutAssetDto.checkout_date;
    assetToUser.checkout_note = checkoutAssetDto.checkout_note;
    await this.assetRepo.save(asset);
    await this.assetToUserRepo.save(assetToUser);
    await this.mailService.sendUserCheckoutAsset(user, asset);
    return assetToUser;
  }

  async checkinAsset(checkinAssetDto: CheckinAssetDto) {
    const asset = await this.assetRepo.findOne({
      where: { id: checkinAssetDto.assetId },
    });
    const department = await this.departmentService.getDepartmentById(
      checkinAssetDto.departmentId,
    );
    const status = await this.statusService.getStatusById(
      checkinAssetDto.statusId,
    );
    const assetToUser = await this.assetToUserRepo.findOneBy({
      asset: { id: checkinAssetDto.assetId },
    });
    asset.department = department;
    asset.status = status;
    assetToUser.checkin_date = checkinAssetDto.checkin_date;
    assetToUser.checkin_note = checkinAssetDto.checkin_note;
    await this.assetRepo.save(asset);
    await this.assetToUserRepo.save(assetToUser);
    await this.assetToUserRepo.softDelete({
      asset: { id: checkinAssetDto.assetId },
    });
    return assetToUser;
  }

  async getAssetById(id: number) {
    const asset: Asset = await this.assetRepo.findOneBy({ id });
    return asset;
  }

  /*------------------------ asset to inventory ------------------------- */

  async getAssetsByDepartmentId(id: number) {
    const assets: Asset[] = await this.assetRepo.find({
      relations: { 
        status: true, 
        assetModel: {
          category: true,
        }, 
      },
      where: { department: { id } },
    });
    return assets;
  }

  async saveAssetAfterInventory(id: number, statusId: number, newCost: number) {
    const asset = await this.assetRepo.findOneBy({ id });
    const status = await this.statusService.getStatusById(statusId);
    asset.status = status;
    asset.current_cost = newCost;
    await this.assetRepo.save(asset);
  }

  /*------------------------ request asset ------------------------- */

  async getAssetsByCategory(categoryId: number) {
    const assetModels =
      await this.assetModelService.getAllAssetModelsByCategory(categoryId);
    const assets2D: Asset[][] = await Promise.all(
      assetModels.map(async (assetModel: AssetModel) => {
        return await this.assetRepo.find({
          where: { assetModel: { id: assetModel.id } },
          relations: { assetToUsers: true },
        });
      }),
    );
    const assets: Asset[] = [].concat(...assets2D);
    return assets
      .filter((asset: Asset) => asset.assetToUsers.length === 0)
      .sort((a, b) => a.id - b.id);
  }

  async getAllRequestAssets() {
    const requestAsset = await this.requestAssetRepo.find({
      relations: { category: true, user: true },
    });
    const res = requestAsset.map((r: RequestAsset) => {
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

  async acceptRequest(id: number, assetId: number) {
    const request = await this.requestAssetRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (request.status !== RequestAssetStatus.REQUESTED)
      throw new HttpException(
        'This request was accepted/rejected',
        HttpStatus.BAD_REQUEST,
      );
    if (
      await this.assetToUserRepo.findOne({ where: { asset: { id: assetId } } })
    )
      throw new HttpException('This asset is in use', HttpStatus.BAD_REQUEST);
    request.status = RequestAssetStatus.ACCEPTED;
    request.assetId = assetId;
    await this.requestAssetRepo.save(request);
    const assetToUser = new AssetToUser();
    const user = await this.userService.getUserById(request.user.id);
    const asset = await this.getAssetById(assetId);
    assetToUser.user = user;
    assetToUser.asset = asset;
    assetToUser.checkout_date = dayjs().toDate();
    await this.assetToUserRepo.save(assetToUser);
    await this.mailService.sendUserAcceptRequest(user, asset);
    return request;
  }

  async rejectRequest(id: number) {
    const request = await this.requestAssetRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    const user = await this.userService.getUserById(request.user.id);
    if (request.status !== RequestAssetStatus.REQUESTED)
      throw new HttpException(
        'This request was accepted/rejected',
        HttpStatus.BAD_REQUEST,
      );
    request.status = RequestAssetStatus.REJECTED;
    await this.requestAssetRepo.save(request);
    await this.mailService.sendUserRejectRequest(user);
    return request;
  }

  /*------------------------ cron ------------------------- */

  // At 00:00 every Sunday
  @Cron('0 0 * * 0')
  async handleCronAssetDeprecation() {
    const deprecations: Deprecation[] =
      await this.deprecationService.getAllDeprecationsForCron();
    await Promise.all(
      deprecations.map(async (deprecation: Deprecation) => {
        const category: Category = deprecation.category;
        const assetModels: AssetModel[] =
          await this.assetModelService.getAllAssetModelsByCategory(category.id);
        await Promise.all(
          assetModels.map(async (assetModel: AssetModel) => {
            const assets: Asset[] = assetModel.assets;
            await Promise.all(
              assets.map(async (asset: Asset) => {
                const months = deprecation.months;
                const purchase_date = asset.purchase_date;
                const date1 = dayjs(purchase_date);
                const date2 = dayjs();
                let diffMonth = date2.diff(date1, 'month');
                asset.current_cost = Math.max(
                  Math.round(
                    (asset.purchase_cost / months) * (months - diffMonth),
                  ),
                  0,
                );
                await this.assetRepo.save(asset);

                let expiration_date = date1.add(months, 'month').toDate();
                let diffDay = dayjs(expiration_date).diff(date2, 'day');
                await this.notificationService.deleteNotification(
                  NotificationType.ASSET,
                  asset.id,
                );
                if (diffDay <= 30) {
                  await this.notificationService.createNewNotification({
                    itemId: asset.id,
                    expiration_date: expiration_date,
                    type: NotificationType.ASSET,
                  });
                }
              }),
            );
          }),
        );
      }),
    );
  }

  /*------------------------ user ------------------------- */

  async getAssetToUser(userId: number) {
    const assetToUsers = await this.assetToUserRepo.find({
      where: { user: { id: userId } },
      relations: { asset: true, user: true },
    });
    const res = await Promise.all(
      assetToUsers.map(async (assetToUser) => {
        const assetId = assetToUser.asset.id;
        const asset = await this.assetRepo.findOne({
          where: {
            id: assetId,
          },
          relations: {
            assetModel: true,
            department: true,
            status: true,
            supplier: true,
          },
        });
        return {
          ...assetToUser.asset,
          assetModel: asset?.assetModel?.name,
          department: asset?.department?.name,
          status: asset?.status?.name,
          statusColor: asset?.status?.color,
          supplier: asset?.supplier?.name,
        };
      }),
    );
    return res;
  }

  async getAssetRequestedByUser(id: number) {
    const requestAsset = await this.requestAssetRepo.find({
      where: { user: { id } },
      relations: { category: true },
    });
    const res = requestAsset.map((r: RequestAsset) => {
      const { category, ...rest } = r;
      return { ...rest, category: category.name };
    });
    return res;
  }

  async createNewRequestAsset(userId: number, newRequest: NewRequestAsset) {
    const newRequestAsset = new RequestAsset();

    const user = await this.userService.getUserById(userId);
    const admins = await this.adminService.getAllAdmins();
    const category = await this.categoryService.getCategoryById(
      newRequest.categoryId,
    );
    if (!category)
      throw new HttpException('Category not exist', HttpStatus.BAD_REQUEST);
    newRequestAsset.user = user;
    newRequestAsset.category = category;
    newRequestAsset.note = newRequest.note;
    await this.requestAssetRepo.save(newRequestAsset);
    await Promise.all(
      admins.map(async (admin) => {
        await this.mailService.sendAdminRequestAsset(user, admin);
      }),
    );
    return newRequestAsset;
  }
}
