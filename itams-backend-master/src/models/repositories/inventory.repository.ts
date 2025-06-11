import { Repository } from 'typeorm';
import Inventory from '../entities/inventory.entity';

export class InventoryRepository extends Repository<Inventory> {}
