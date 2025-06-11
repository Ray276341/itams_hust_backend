import { UseGuards, Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { SoftwareUpdateService } from './softwareUpdate.service';
import { CreateSoftwareUpdateDto } from './dtos/createSoftwareUpdate.dto';
import { UpdateSoftwareUpdateDto } from './dtos/updateSoftwareUpdate.dto';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';

@Controller('license-updates')
@UseGuards(JwtAllAuthGuard)
export class SoftwareUpdateController {
  constructor(private readonly licenseUpdateSoftware: SoftwareUpdateService) {}

  @Post()
  create(@Body() dto: CreateSoftwareUpdateDto) {
    return this.licenseUpdateSoftware.create(dto);
  }

  @Get('license/:licenseId')
  findAllBySoftware(@Param('licenseId') licenseId: number) {
    return this.licenseUpdateSoftware.findAllBySoftware(+licenseId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.licenseUpdateSoftware.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateSoftwareUpdateDto) {
    return this.licenseUpdateSoftware.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.licenseUpdateSoftware.remove(+id);
  }
}
