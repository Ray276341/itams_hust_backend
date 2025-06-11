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
import { StatusDto } from './dtos/status.dto';
import { StatusService } from './status.service';

@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllStatuses() {
    return await this.statusService.getAllStatuses();
  }

  @Get('get-status-by-id/:id')
  @UseGuards(JwtAllAuthGuard)
  async getStatusById(@Param('id', ParseIntPipe) id: number) {
    return await this.statusService.getStatusById(id);
  }

  @Post('create-status')
  @UseGuards(JwtAdminAuthGuard)
  async createStatus(@Body() statusDto: StatusDto) {
    return await this.statusService.createNewStatus(statusDto);
  }

  @Put('update-status')
  @UseGuards(JwtAdminAuthGuard)
  async updateStatus(
    @Body() statusDto: StatusDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.statusService.updateStatus(id, statusDto);
  }

  @Delete('delete-status')
  @UseGuards(JwtAdminAuthGuard)
  async deleteStatus(@Body('id', ParseIntPipe) id: number) {
    return await this.statusService.deleteStatus(id);
  }
}
