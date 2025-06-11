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
import { ManufacturerDto } from './dtos/manufacturer.dto';
import { ManufacturerService } from './manufacturer.service';

@ApiTags('manufacturer')
@Controller('manufacturer')
export class ManufacturerController {
  constructor(private manufacturerService: ManufacturerService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllManufacturers() {
    return await this.manufacturerService.getAllManufacturers();
  }

  @Get('get-manufacturer-by-id/:id')
  @UseGuards(JwtAllAuthGuard)
  async getManufacturerById(@Param('id', ParseIntPipe) id: number) {
    return await this.manufacturerService.getManufacturerById(id);
  }

  @Post('create-manufacturer')
  @UseGuards(JwtAdminAuthGuard)
  async createManufacturer(@Body() manufacturerDto: ManufacturerDto) {
    return await this.manufacturerService.createNewManufacturer(
      manufacturerDto,
    );
  }

  @Post('save-image')
  @UseGuards(JwtAdminAuthGuard)
  @UseInterceptors(FileInterceptor('image', imageStorageOptions))
  async saveImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('id', ParseIntPipe) id: number,
  ) {
    const res = await this.manufacturerService.saveImage(id, file);
    return res;
  }

  @Put('update-manufacturer')
  @UseGuards(JwtAdminAuthGuard)
  async updateManufacturer(
    @Body() manufacturerDto: ManufacturerDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.manufacturerService.updateManufacturer(
      id,
      manufacturerDto,
    );
  }

  @Delete('delete-manufacturer')
  @UseGuards(JwtAdminAuthGuard)
  async deleteManufacturer(@Body('id', ParseIntPipe) id: number) {
    return await this.manufacturerService.deleteManufacturer(id);
  }
}
