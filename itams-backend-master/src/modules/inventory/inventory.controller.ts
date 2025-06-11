import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { InventoryDto } from './dtos/inventory.dto';
import { UpdateAssetToInventoryDto } from './dtos/update-asset-to-inventory.dto';
import { InventoryService } from './inventory.service';
import { UpdateLicenseToInventoryDto } from './dtos/update-license-to-inventory.dto';
import { UpdateServiceToInventoryDto } from './dtos/update-service-to-inventory.dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get('all')
  @UseGuards(JwtAdminAuthGuard)
  async getAllInventories() {
    return await this.inventoryService.getAllInventories();
  }

  @Get('get-inventory-by-id')
  @UseGuards(JwtAdminAuthGuard)
  async getInventoryById(@Query('id', ParseIntPipe) id: number) {
    return await this.inventoryService.getInventoryById(id);
  }

  @Post('create-inventory')
  @UseGuards(JwtAdminAuthGuard)
  async createInventory(@Body() inventoryDto: InventoryDto) {
    return await this.inventoryService.createInventory(inventoryDto);
  }

  @Put('update-inventory')
  @UseGuards(JwtAdminAuthGuard)
  async updateInventory(
    @Body() inventoryDto: InventoryDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.inventoryService.updateInventory(id, inventoryDto);
  }

  @Get('get-asset-to-inventory')
  @UseGuards(JwtAdminAuthGuard)
  async getAssetToInventoryByInventoryId(
    @Query('id', ParseIntPipe) id: number,
  ) {
    return await this.inventoryService.getAssetToInventoryByInventoryId(id);
  }

  @Put('update-asset-to-inventory')
  @UseGuards(JwtAdminAuthGuard)
  async updateAssetToInventory(
    @Body() updateDto: UpdateAssetToInventoryDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.inventoryService.updateAssetToInventory(id, updateDto);
  }

  @Get('get-license-to-inventory')
  @UseGuards(JwtAdminAuthGuard)
  async getLicenseToInventoryByInventoryId(
    @Query('id', ParseIntPipe) id: number,
  ) {
    return await this.inventoryService.getLicenseToInventoryByInventoryId(id);
  }

  @Put('update-license-to-inventory')
  @UseGuards(JwtAdminAuthGuard)
  async updateLicenseToInventory(
    @Body() updateDto: UpdateLicenseToInventoryDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.inventoryService.updateLicenseToInventory(id, updateDto);
  }

  @Get('get-service-to-inventory')
  @UseGuards(JwtAdminAuthGuard)
  async getServiceToInventoryByInventoryId(
    @Query('id', ParseIntPipe) id: number,
  ) {
    return await this.inventoryService.getServiceToInventoryByInventoryId(id);
  }

  @Put('update-service-to-inventory')
  @UseGuards(JwtAdminAuthGuard)
  async updateServiceToInventory(
    @Body() updateDto: UpdateServiceToInventoryDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.inventoryService.updateServiceToInventory(id, updateDto);
  }
}
