import { PartialType } from '@nestjs/mapped-types';
import { CreateSoftwareUsageDto } from './createSoftwareUsage.dto';

export class UpdateSoftwareUsageDto extends PartialType(CreateSoftwareUsageDto) {}