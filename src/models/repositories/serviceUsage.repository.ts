import { Repository } from 'typeorm';
import ServiceUsage from '../entities/serviceUsage.entity';

export class ServiceUsageRepository extends Repository<ServiceUsage> {}
