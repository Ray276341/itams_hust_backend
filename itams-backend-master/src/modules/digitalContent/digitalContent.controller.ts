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
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { DigitalContentDto } from './dtos/digitalContent.dto';
import { DigitalContentService } from './digitalContent.service';
import { CheckoutDigitalContentDto } from './dtos/checkoutDigitalContent.dto';
import { CheckinDigitalContentDto } from './dtos/checkinDigitalContent.dto';
import { DigitalContentToSourceCodeQueryDto } from './dtos/digitalContentToSourceCode.dto';

@ApiTags('digital-content')
@Controller('digital-content')
export class DigitalContentController {
  constructor(private digitalContentService: DigitalContentService) {}

  @Get('all')
  @UseGuards(JwtAllAuthGuard)
  async getAllDigitalContents() {
    return await this.digitalContentService.getAllDigitalContents();
  }

  @Get('get-digital-content-by-id/:id')
  @UseGuards(JwtAllAuthGuard)
  async getDigitalContentById(@Param('id', ParseIntPipe) id: number) {
    return await this.digitalContentService.getDigitalContentById(id);
  }

  @Get('digital-content-to-source-code')
  @UseGuards(JwtAdminAuthGuard)
  async getDigitalContentToDigitalContent(
    @Query() digitalContentToSourceDto: DigitalContentToSourceCodeQueryDto,
  ) {
    return await this.digitalContentService.getDigitalContentToSourceCode(
      digitalContentToSourceDto,
    );
  }

  @Post('create-digital-content')
  @UseGuards(JwtAdminAuthGuard)
  async createDigitalContent(@Body() digitalContentDto: DigitalContentDto) {
    return await this.digitalContentService.createNewDigitalContent(
      digitalContentDto,
    );
  }

  @Put('update-digital-content')
  @UseGuards(JwtAdminAuthGuard)
  async updateDigitalContent(
    @Body() digitalContentDto: DigitalContentDto,
    @Body('id', ParseIntPipe) id: number,
  ) {
    return await this.digitalContentService.updateDigitalContent(
      id,
      digitalContentDto,
    );
  }

  @Delete('delete-digital-content')
  @UseGuards(JwtAdminAuthGuard)
  async deleteDigitalContent(@Body('id', ParseIntPipe) id: number) {
    return await this.digitalContentService.deleteDigitalContent(id);
  }

  @Post('checkout-digital-content')
  @UseGuards(JwtAdminAuthGuard)
  async checkoutDigitalContent(
    @Body() checkoutDigitalContentDto: CheckoutDigitalContentDto,
  ) {
    return await this.digitalContentService.checkoutDigitalContent(
      checkoutDigitalContentDto,
    );
  }

  @Post('checkin-digital-content')
  @UseGuards(JwtAdminAuthGuard)
  async checkinDigitalContent(
    @Body() checkinDigitalContentDto: CheckinDigitalContentDto,
  ) {
    return await this.digitalContentService.checkinDigitalContent(
      checkinDigitalContentDto,
    );
  }
}
