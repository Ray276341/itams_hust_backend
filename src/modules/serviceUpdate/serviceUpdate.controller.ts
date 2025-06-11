import { UseGuards, Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { ServiceUpdateService } from './serviceUpdate.service';
import { CreateServiceUpdateDto } from './dtos/createServiceUpdate.dto';
import { UpdateServiceUpdateDto } from './dtos/updateServiceUpdate.dto';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';

@Controller('service-updates')
@UseGuards(JwtAllAuthGuard)
export class ServiceUpdateController {
  constructor(private readonly serviceUpdateService: ServiceUpdateService) {}

  @Post()
  create(@Body() dto: CreateServiceUpdateDto) {
    return this.serviceUpdateService.create(dto);
  }

  @Get('service/:serviceId')
  findAllByService(@Param('serviceId') serviceId: number) {
    return this.serviceUpdateService.findAllByService(+serviceId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.serviceUpdateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateServiceUpdateDto) {
    return this.serviceUpdateService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.serviceUpdateService.remove(+id);
  }
}
