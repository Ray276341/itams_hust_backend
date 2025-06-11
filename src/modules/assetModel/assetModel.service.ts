import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AssetModel from 'src/models/entities/assetModel.entity';
import { AssetModelRepository } from 'src/models/repositories/assetModel.repository';
import { CategoryService } from '../category/category.service';
import { FirebaseService } from '../firebase/firebase.service';
import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { IMAGE_PATH } from './assetModel.constants';
import { AssetModelDto } from './dtos/assetModel.dto';
import { AssetModelQueryDto } from './dtos/assetModelQuery.dto';

@Injectable()
export class AssetModelService {
  private logger = new Logger(AssetModelService.name);

  constructor(
    @InjectRepository(AssetModel) private assetModelRepo: AssetModelRepository,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
    private firebaseService: FirebaseService,
  ) {}

  async getAllAssetModels(assetModelQuery?: AssetModelQueryDto) {
    const assetModels = await this.assetModelRepo.find({
      relations: { assets: true, category: true, manufacturer: true },
      where: {
        category: { id: assetModelQuery.categoryId },
        manufacturer: { id: assetModelQuery.manufacturerId },
      },
    });
    const res = assetModels.map((assetModel) => {
      const { assets, category, manufacturer, ...rest } = assetModel;
      return {
        ...rest,
        numOfAssets: assets.length,
        category: category?.name,
        manufacturer: manufacturer?.name,
      };
    });
    return res;
  }

  async getAssetModelByAssetModelId(id: number) {
    const assetModel = await this.assetModelRepo.findOne({
      where: { id },
      relations: { category: true, manufacturer: true },
    });
    const { category, manufacturer, ...rest } = assetModel;
    return {
      ...rest,
      category: category?.name,
      manufacturer: manufacturer?.name,
    };
  }

  async getAssetModelById(id: number) {
    const assetModel = await this.assetModelRepo.findOneBy({ id });
    return assetModel;
  }

  async createNewAssetModel(assetModelDto: AssetModelDto) {
    if (await this.assetModelRepo.findOneBy({ name: assetModelDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const category = await this.categoryService.getCategoryById(
      assetModelDto.categoryId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      assetModelDto.manufacturerId,
    );

    const assetModel = new AssetModel();
    assetModel.name = assetModelDto.name;
    assetModel.category = category;
    assetModel.manufacturer = manufacturer;
    assetModel.cpe = this.createCPE(manufacturer.name, assetModelDto.name);
    await this.assetModelRepo.save(assetModel);
    return assetModel;
  }

  async saveImage(id: number, file: Express.Multer.File) {
    // upload ảnh lên storage
    const image = await this.firebaseService.uploadFile(file, IMAGE_PATH);
    // cập nhật db
    return await this.assetModelRepo.update({ id }, { image });
  }

  async updateAssetModel(id: number, assetModelDto: AssetModelDto) {
    if (
      (await this.assetModelRepo.findOneBy({ id }))?.name !==
        assetModelDto.name &&
      (await this.assetModelRepo.findOneBy({ name: assetModelDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    let toUpdate = await this.assetModelRepo.findOneBy({ id });
    let { categoryId, manufacturerId, ...rest } = assetModelDto;
    const category = await this.categoryService.getCategoryById(
      assetModelDto.categoryId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      assetModelDto.manufacturerId,
    );
    let updated = Object.assign(toUpdate, rest);
    updated.category = category;
    updated.manufacturer = manufacturer;
    updated.cpe = this.createCPE(manufacturer.name, assetModelDto.name);
    return await this.assetModelRepo.save(updated);
  }

  async deleteAssetModel(id: number) {
    try {
      return await this.assetModelRepo.delete({ id });
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  createCPE(vendor: string, product: string) {
    vendor = vendor.toLowerCase().replace(new RegExp(' ', 'g'), '_');
    product = product.toLowerCase().replace(new RegExp(' ', 'g'), '_');
    return `cpe:/h:${vendor}:${product}`;
  }

  /*------------------------ cron ------------------------- */
  async getAllAssetModelsByCategory(categoryId: number) {
    const assetModels: AssetModel[] = await this.assetModelRepo.find({
      where: { category: { id: categoryId } },
      relations: { assets: true, category: true, manufacturer: true },
    });
    return assetModels;
  }
}
