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
import { SoftwareDependencyService } from './softwareDependency.service';
import { SoftwareDependencyDto } from './dtos/softwareDependency.dto';
import { SoftwareDependencyResponseDto } from './dtos/softwareDependencyResponse.dto';

@ApiTags('license-dependency')
@Controller('license-dependency')
export class SoftwareDependencyController {
  constructor(private readonly svc: SoftwareDependencyService) {}

  @Get('get-license-dependency-by-id/:id')
  @UseGuards(JwtAdminAuthGuard)
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SoftwareDependencyResponseDto> {
    return this.svc.findOne(id);
  }

  @Get('get-outgoing-by-license-id/:licenseId')
  @UseGuards(JwtAdminAuthGuard)
  async getOutgoing(
    @Param('licenseId', ParseIntPipe) licenseId: number,
  ): Promise<SoftwareDependencyResponseDto[]> {
    return this.svc.findOutgoing(licenseId);
  }

  @Get('get-incoming-by-license-id/:licenseId')
  @UseGuards(JwtAdminAuthGuard)
  async getIncoming(
    @Param('licenseId', ParseIntPipe) licenseId: number,
  ): Promise<SoftwareDependencyResponseDto[]> {
    return this.svc.findIncoming(licenseId);
  }

  @Post('create-license-dependency')
  @UseGuards(JwtAdminAuthGuard)
  async create(
    @Body() dto: SoftwareDependencyDto,
  ): Promise<SoftwareDependencyResponseDto> {
    return this.svc.create(dto);
  }

  @Put('update-license-dependency')
  @UseGuards(JwtAdminAuthGuard)
  async update(
    @Body('id', ParseIntPipe) id: number,
    @Body() dto: SoftwareDependencyDto,
  ): Promise<SoftwareDependencyResponseDto> {
    return this.svc.update(id, dto);
  }

  @Delete('delete-license-dependency')
  @UseGuards(JwtAdminAuthGuard)
  async delete(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<{ deleted: true }> {
    return this.svc.remove(id);
  }
}
