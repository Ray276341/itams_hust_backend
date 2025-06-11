import {
  Controller,
  Get,
  UseGuards,
  Post,
  Put,
  Body,
  ParseIntPipe,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { imageStorageOptions } from 'src/helpers/imageStorage';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { CategoryService } from './category.service';
import { CategoryDto } from './dtos/category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Get('get-category-by-id/:id')
  @UseGuards(JwtAllAuthGuard)
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getCategoryById(id);
  }

  @Post('create-category')
  @UseGuards(JwtAdminAuthGuard)
  async createCategory(@Body() categoryDto: CategoryDto) {
    return await this.categoryService.createNewCategory(categoryDto);
  }

  @Post('save-image')
  @UseGuards(JwtAdminAuthGuard)
  @UseInterceptors(FileInterceptor('image', imageStorageOptions))
  async saveImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('id', ParseIntPipe) id: number,
  ) {
    const res = await this.categoryService.saveImage(id, file);
    return res;
  }

  @Put('update-category')
  @UseGuards(JwtAdminAuthGuard)
  async updateCategory(
    @Body() categoryDto: CategoryDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.categoryService.updateCategory(id, categoryDto);
  }

  @Delete('delete-category')
  @UseGuards(JwtAdminAuthGuard)
  async deleteCategory(@Body('id', ParseIntPipe) id: number) {
    return await this.categoryService.deleteCategory(id);
  }
}
