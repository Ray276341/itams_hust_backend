import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/models/entities/category.entity';
import { CategoryRepository } from 'src/models/repositories/category.repository';
import { FirebaseService } from '../firebase/firebase.service';
import { IMAGE_PATH } from './category.constants';
import { CategoryDto } from './dtos/category.dto';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category) private categoryRepo: CategoryRepository,
    private firebaseService: FirebaseService,
  ) {}

  async getAllCategories() {
    const categories = await this.categoryRepo.find({
      relations: { assetModels: true, licenses: true },
    });
    const res = categories.map((category) => {
      const { assetModels, licenses, ...rest } = category;
      return {
        ...rest,
        assetModels: assetModels.length,
        licenses: licenses.length,
      };
    });
    return res;
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });
    return category;
  }

  async createNewCategory(categoryDto: CategoryDto) {
    if (await this.categoryRepo.findOneBy({ name: categoryDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const category = new Category();
    category.name = categoryDto.name;
    await this.categoryRepo.save(category);
    return category;
  }

  async saveImage(id: number, file: Express.Multer.File) {
    // upload ảnh lên storage
    const image = await this.firebaseService.uploadFile(file, IMAGE_PATH);
    // cập nhật db
    return await this.categoryRepo.update({ id }, { image });
  }

  async updateCategory(id: number, categoryDto: CategoryDto) {
    if (
      (await this.categoryRepo.findOneBy({ id }))?.name !== categoryDto.name &&
      (await this.categoryRepo.findOneBy({ name: categoryDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    let toUpdate = await this.categoryRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, categoryDto);
    return await this.categoryRepo.save(updated);
  }

  async deleteCategory(id: number) {
    try {
      return await this.categoryRepo.delete({ id });
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
