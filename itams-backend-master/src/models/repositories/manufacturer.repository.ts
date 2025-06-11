import { Repository } from 'typeorm';
import Manufacturer from '../entities/manufacturer.entity';

export class ManufacturerRepository extends Repository<Manufacturer> {}
