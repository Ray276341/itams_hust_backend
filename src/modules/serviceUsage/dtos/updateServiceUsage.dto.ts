import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceUsageDto } from './createServiceUsage.dto';

export class UpdateServiceUsageDto extends PartialType(CreateServiceUsageDto) {}