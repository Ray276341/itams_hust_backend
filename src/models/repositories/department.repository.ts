import { Repository } from 'typeorm';
import Department from '../entities/department.entity';

export class DepartmentRepository extends Repository<Department> {}
