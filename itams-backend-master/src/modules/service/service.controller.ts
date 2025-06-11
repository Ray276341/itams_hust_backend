import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Put,
  Body,
  ParseIntPipe,
  Delete,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckinServiceDto } from './dtos/checkinService.dto';
import { CheckoutServiceDto } from './dtos/checkoutService.dto';
import { ServiceDto } from './dtos/service.dto';
import { ServiceQueryDto } from './dtos/serviceQuery.dto';
import { ServiceToUserQueryDto } from './dtos/serviceToUser.dto';
import { ServicePriceDto } from './dtos/servicePrice.dto';
import { ServiceService } from './service.service';
import { NewRequestService } from './dtos/new-request-service.dto';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @Get('all-services')
  @UseGuards(JwtAdminAuthGuard)
  async getAllServices(@Query() serviceQuery: ServiceQueryDto) {
    return await this.serviceService.getAll(serviceQuery);
  }

  @Get('get-service-by-id/:id')
  @UseGuards(JwtAdminAuthGuard)
  async getServiceById(@Param('id', ParseIntPipe) id: number) {
    return await this.serviceService.getServiceByServiceId(id);
  }

  @Get('service-to-user')
  @UseGuards(JwtAdminAuthGuard)
  async getServiceToUser(@Query() serviceToUserDto: ServiceToUserQueryDto) {
    return await this.serviceService.getServiceToUser(serviceToUserDto);
  }

  @Post('create-service')
  @UseGuards(JwtAdminAuthGuard)
  async createService(@Body() serviceDto: ServiceDto) {
    return await this.serviceService.createNewService(serviceDto);
  }

  @Put('update-service')
  @UseGuards(JwtAdminAuthGuard)
  async updateService(
    @Body() serviceDto: ServiceDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.serviceService.updateService(id, serviceDto);
  }

  @Delete('delete-service')
  @UseGuards(JwtAdminAuthGuard)
  async deleteService(@Body('id', ParseIntPipe) id: number) {
    return await this.serviceService.deleteService(id);
  }



  @Post('checkout-service')
  @UseGuards(JwtAdminAuthGuard)
  async checkoutService(@Body() checkoutServiceDto: CheckoutServiceDto) {
    return await this.serviceService.checkoutService(checkoutServiceDto);
  }

  @Post('checkin-service')
  @UseGuards(JwtAdminAuthGuard)
  async checkinService(@Body() checkinServiceDto: CheckinServiceDto) {
    return await this.serviceService.checkinService(checkinServiceDto);
  }


  @Post('create-service-price')
  @UseGuards(JwtAdminAuthGuard)
  async createServicePrice(@Body() servicePriceDto: ServicePriceDto) {
    return await this.serviceService.createServicePrice(servicePriceDto);
  }

  @Get('get-service-prices/:id')
  @UseGuards(JwtAdminAuthGuard)
  async getServicePrices(@Param('id', ParseIntPipe) serviceId: number) {
    return await this.serviceService.getServicePrices(serviceId);
  }

  @Get('get-service-price-by-id/:id')
  @UseGuards(JwtAdminAuthGuard)
  async getServicePriceById(@Param('id', ParseIntPipe) servicePriceId: number) {
    return await this.serviceService.getServicePriceById(servicePriceId);
  }

  @Put('update-service-price')
  @UseGuards(JwtAdminAuthGuard)
  async updateServicePrice(@Body() servicePriceDto: ServicePriceDto) {
    return await this.serviceService.updateServicePrice(servicePriceDto);
  }

  @Delete('delete-service-price')
  @UseGuards(JwtAdminAuthGuard)
  async deleteServicePrice(
    @Query('servicePriceId', ParseIntPipe) servicePriceId: number,
  ) {
    return await this.serviceService.deleteServicePrice(servicePriceId);
  }

  @Get('all-request-services')
  @UseGuards(JwtAdminAuthGuard)
  async getAllRequestServices() {
    return await this.serviceService.getAllRequestServices();
  }

  @Post('accept-request')
  @UseGuards(JwtAdminAuthGuard)
  async acceptRequest(
    @Body('id', ParseIntPipe) id: number,
    @Body('serviceId', ParseIntPipe) serviceId: number,
  ) {
    return await this.serviceService.acceptRequest(id, serviceId);
  }

  @Post('reject-request')
  @UseGuards(JwtAdminAuthGuard)
  async rejectRequest(@Body('id', ParseIntPipe) id: number) {
    return await this.serviceService.rejectRequest(id);
  }

  @Get('service-by-category')
  @UseGuards(JwtAdminAuthGuard)
  async getServicesByModel(@Query('categoryId') categoryId: number) {
    return await this.serviceService.getServicesByCategory(categoryId);
  }
  
  @Get('service-to-user-by-user')
  @UseGuards(JwtAuthGuard)
  async getServiceToUserByUser(@Request() request) {
    return await this.serviceService.getServiceToUserByUser(request.user.id);
  }

  @Get('service-requested')
  @UseGuards(JwtAuthGuard)
  async getServiceRequested(@Request() request) {
    return await this.serviceService.getServiceRequestedByUser(request.user.id);
  }

  @Post('new-request')
  @UseGuards(JwtAuthGuard)
  async createNewRequest(
    @Request() request,
    @Body() newRequest: NewRequestService,
  ) {
    return await this.serviceService.createNewRequestService(
      request.user.id,
      newRequest,
    );
  }
}
