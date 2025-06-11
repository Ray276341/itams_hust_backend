import { UseGuards, Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { ServiceUsageService } from './serviceUsage.service';
import { CreateServiceUsageDto } from './dtos/createServiceUsage.dto';
import { UpdateServiceUsageDto } from './dtos/updateServiceUsage.dto';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';

@Controller('service-usages')
@UseGuards(JwtAllAuthGuard)
export class ServiceUsageController {
  constructor(private readonly usageService: ServiceUsageService) {}

  @Post()
  create(@Body() dto: CreateServiceUsageDto) {
    return this.usageService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usageService.findOne(+id);
  }

  @Get('service/:serviceId')
  findAllByService(@Param('serviceId') serviceId: number) {
    return this.usageService.findByService(+serviceId);
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: number) {
    return this.usageService.findByUser(+userId);
  }

  @Get('metric/:usageMetric')
  findAllByMetric(@Param('usageMetric') usageMetric: string) {
    return this.usageService.findByMetric(usageMetric);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateServiceUsageDto) {
    return this.usageService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usageService.remove(+id);
  }
}
