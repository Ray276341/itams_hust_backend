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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { SupplierDto } from './dtos/supplier.dto';
import { SupplierService } from './supplier.service';

@ApiTags('supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllSuppliers() {
    return await this.supplierService.getAllSuppliers();
  }

  @Get('get-supplier-by-id/:id')
  @UseGuards(JwtAllAuthGuard)
  async geSupplierById(@Param('id', ParseIntPipe) id: number) {
    return await this.supplierService.getSupplierById(id);
  }

  @Post('create-supplier')
  @UseGuards(JwtAdminAuthGuard)
  async createSupplier(@Body() supplierDto: SupplierDto) {
    return await this.supplierService.createNewSupplier(supplierDto);
  }

  @Put('update-supplier')
  @UseGuards(JwtAdminAuthGuard)
  async updateSupplier(
    @Body() supplierDto: SupplierDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.supplierService.updateSupplier(id, supplierDto);
  }

  @Delete('delete-supplier')
  @UseGuards(JwtAdminAuthGuard)
  async deleteSupplier(@Body('id', ParseIntPipe) id: number) {
    return await this.supplierService.deleteSupplier(id);
  }
}
