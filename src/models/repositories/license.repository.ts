import { Repository } from 'typeorm';
import License from '../entities/license.entity';

export class LicenseRepository extends Repository<License> {}
