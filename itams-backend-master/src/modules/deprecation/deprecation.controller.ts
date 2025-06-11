import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { DeprecationService } from './deprecation.service';
import { DeprecationDto } from './dtos/deprecation.dto';

@ApiTags('deprecation')
@Controller('deprecation')
export class DeprecationController {
  constructor(private deprecationService: DeprecationService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllDeprecations() {
    return await this.deprecationService.getAllDeprecations();
  }

  @Get('get-deprecation-by-id')
  @UseGuards(JwtAllAuthGuard)
  async getDeprecationById(@Body('id', ParseIntPipe) id: number) {
    return await this.deprecationService.getDeprecationById(id);
  }

  @Post('create-deprecation')
  @UseGuards(JwtAdminAuthGuard)
  async createDeprecation(@Body() deprecationDto: DeprecationDto) {
    return await this.deprecationService.createNewDeprecation(deprecationDto);
  }

  @Put('update-deprecation')
  @UseGuards(JwtAdminAuthGuard)
  async updateDeprecation(
    @Body() deprecationDto: DeprecationDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.deprecationService.updateDeprecation(id, deprecationDto);
  }

  @Delete('delete-deprecation')
  @UseGuards(JwtAdminAuthGuard)
  async deleteDeprecation(@Body('id', ParseIntPipe) id: number) {
    return await this.deprecationService.deleteDeprecation(id);
  }
}
