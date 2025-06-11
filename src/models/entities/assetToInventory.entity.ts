import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import Asset from './asset.entity';
import Inventory from './inventory.entity';
import Status from './status.entity';

@Entity()
export class AssetToInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.assetToInventories)
  inventory: Inventory;

  @ManyToOne(() => Asset, (asset) => asset.assetToUsers)
  asset: Asset;

  @Column({ default: null })
  old_cost: number;

  @Column({ default: null })
  new_cost: number;

  @Column({ default: null })
  estimated_cost: number; 
  
  @ManyToOne(() => Status, (status) => status.assetToInventories)
  old_status: Status;

  @ManyToOne(() => Status, (status) => status.assetToInventories)
  new_status: Status;

  @Column({ default: false })
  check: boolean;
}

export default AssetToInventory;
