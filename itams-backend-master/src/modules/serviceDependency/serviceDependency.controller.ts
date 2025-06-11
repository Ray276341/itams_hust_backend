import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { ServiceDependencyService } from './serviceDependency.service';
import { ServiceDependencyDto } from './dtos/serviceDependency.dto';
import { ServiceDependencyResponseDto } from './dtos/serviceDependencyResponse.dto';

@ApiTags('service-dependency')
@Controller('service-dependency')
export class ServiceDependencyController {
  constructor(private readonly svc: ServiceDependencyService) {}

  @Get('get-service-dependency-by-id/:id')
  @UseGuards(JwtAdminAuthGuard)
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceDependencyResponseDto> {
    return this.svc.findOne(id);
  }

  @Get('get-outgoing-by-service-id/:serviceId')
  @UseGuards(JwtAdminAuthGuard)
  async getOutgoing(
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ): Promise<ServiceDependencyResponseDto[]> {
    return this.svc.findOutgoing(serviceId);
  }

  @Get('get-incoming-by-service-id/:serviceId')
  @UseGuards(JwtAdminAuthGuard)
  async getIncoming(
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ): Promise<ServiceDependencyResponseDto[]> {
    return this.svc.findIncoming(serviceId);
  }

  @Post('create-service-dependency')
  @UseGuards(JwtAdminAuthGuard)
  async create(
    @Body() dto: ServiceDependencyDto,
  ): Promise<ServiceDependencyResponseDto> {
    return this.svc.create(dto);
  }

  @Put('update-service-dependency')
  @UseGuards(JwtAdminAuthGuard)
  async update(
    @Body('id', ParseIntPipe) id: number,
    @Body() dto: ServiceDependencyDto,
  ): Promise<ServiceDependencyResponseDto> {
    return this.svc.update(id, dto);
  }

  @Delete('delete-service-dependency')
  @UseGuards(JwtAdminAuthGuard)
  async delete(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<{ deleted: true }> {
    return this.svc.remove(id);
  }
}
