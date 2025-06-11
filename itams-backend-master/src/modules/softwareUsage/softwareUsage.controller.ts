import { UseGuards, Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { SoftwareUsageService } from './softwareUsage.service';
import { CreateSoftwareUsageDto } from './dtos/createSoftwareUsage.dto';
import { UpdateSoftwareUsageDto } from './dtos/updateSoftwareUsage.dto';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';

@Controller('license-usages')
@UseGuards(JwtAllAuthGuard)
export class SoftwareUsageController {
  constructor(private readonly usageService: SoftwareUsageService) {}

  @Post()
  create(@Body() dto: CreateSoftwareUsageDto) {
    return this.usageService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usageService.findOne(+id);
  }

  @Get('license/:licenseId')
  findAllByLicense(@Param('licenseId') licenseId: number) {
    return this.usageService.findByLicense(+licenseId);
  }

  @Get('asset/:assetId')
  findAllByAsset(@Param('assetId') assetId: number) {
    return this.usageService.findByAsset(+assetId);
  }

  @Get('metric/:usageMetric')
  findAllByMetric(@Param('usageMetric') usageMetric: string) {
    return this.usageService.findByMetric(usageMetric);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateSoftwareUsageDto) {
    return this.usageService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usageService.remove(+id);
  }
}
