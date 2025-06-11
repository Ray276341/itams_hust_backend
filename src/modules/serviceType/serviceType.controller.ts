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
import { ServiceTypeDto } from './dtos/serviceType.dto';
import { ServiceTypeService } from './serviceType.service';

@ApiTags('service-type')
@Controller('service-type')
export class ServiceTypeController {
  constructor(private serviceTypeService: ServiceTypeService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllServiceTypes() {
    return await this.serviceTypeService.getAllServiceTypes();
  }

  @Get('get-service-type-by-id/:id')
  @UseGuards(JwtAllAuthGuard)
  async geServiceTypeById(@Param('id', ParseIntPipe) id: number) {
    return await this.serviceTypeService.getServiceTypeById(id);
  }

  @Post('create-service-type')
  @UseGuards(JwtAdminAuthGuard)
  async createServiceType(@Body() serviceTypeDto: ServiceTypeDto) {
    return await this.serviceTypeService.createNewServiceType(serviceTypeDto);
  }

  @Put('update-service-type')
  @UseGuards(JwtAdminAuthGuard)
  async updateServiceType(
    @Body() serviceTypeDto: ServiceTypeDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.serviceTypeService.updateServiceType(id, serviceTypeDto);
  }

  @Delete('delete-service-type')
  @UseGuards(JwtAdminAuthGuard)
  async deleteServiceType(@Body('id', ParseIntPipe) id: number) {
    return await this.serviceTypeService.deleteServiceType(id);
  }
}
