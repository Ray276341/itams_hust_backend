import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Deprecation from '../../models/entities/deprecation.entity';
import { DeprecationRepository } from '../../models/repositories/deprecation.repository';
import { CategoryService } from '../category/category.service';
import { DeprecationDto } from './dtos/deprecation.dto';

@Injectable()
export class DeprecationService {
  private logger = new Logger(DeprecationService.name);

  constructor(
    @InjectRepository(Deprecation)
    private deprecationRepo: DeprecationRepository,
    private categoryService: CategoryService,
  ) {}

  async getAllDeprecations() {
    const deprecations = await this.deprecationRepo.find({
      relations: { category: true },
    });
    const res = deprecations.map((deprecation) => {
      const { category, ...rest } = deprecation;
      return {
        ...rest,
        category: category.name,
      };
    });
    return res;
  }

  async getDeprecationById(id: number) {
    const deprecation = await this.deprecationRepo.findOneBy({ id });
    return deprecation;
  }

  async createNewDeprecation(deprecationDto: DeprecationDto) {
    if (
      await this.deprecationRepo.findOne({
        where: { category: { id: deprecationDto.categoryId } },
      })
    )
      throw new HttpException(
        'This category has been set',
        HttpStatus.BAD_REQUEST,
      );
    const deprecation = new Deprecation();
    deprecation.name = deprecationDto.name;
    deprecation.months = deprecationDto.months;
    const category = await this.categoryService.getCategoryById(
      deprecationDto.categoryId,
    );
    deprecation.category = category;
    await this.deprecationRepo.save(deprecation);
    return deprecation;
  }

  async updateDeprecation(id: number, deprecationDto: DeprecationDto) {
    try {
      let toUpdate = await this.deprecationRepo.findOneBy({ id });

      let updated = Object.assign(toUpdate, deprecationDto);
      const category = await this.categoryService.getCategoryById(
        deprecationDto.categoryId,
      );
      updated.category = category;
      return await this.deprecationRepo.save(updated);
    } catch (err) {
      throw new HttpException(
        'This category has been set',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteDeprecation(id: number) {
    return await this.deprecationRepo.delete({ id });
  }

  /*------------------------ cron ------------------------- */
  async getAllDeprecationsForCron() {
    const deprecations = await this.deprecationRepo.find({
      relations: { category: true },
    });
    return deprecations;
  }
}
