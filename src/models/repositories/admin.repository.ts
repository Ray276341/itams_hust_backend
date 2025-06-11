import { Repository } from 'typeorm';
import AdminEntity from '../entities/admin.entity';

export class AdminRepository extends Repository<AdminEntity> {}
