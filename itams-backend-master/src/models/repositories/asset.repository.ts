import { Repository } from 'typeorm';
import Asset from '../entities/asset.entity';

export class AssetRepository extends Repository<Asset> {}
