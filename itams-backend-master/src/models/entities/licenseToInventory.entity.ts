import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import License from './license.entity';
import Inventory from './inventory.entity';
import Status from './status.entity';

@Entity()
export class LicenseToInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.licenseToInventories)
  inventory: Inventory;

  @ManyToOne(() => License, (license) => license.licenseToAssets)
  license: License;

  @Column({ default: null })
  old_cost: number;

  @Column({ default: null })
  new_cost: number;

  @Column({ default: null })
  estimated_cost: number; 
  
  @ManyToOne(() => Status, (status) => status.licenseToInventories)
  old_status: Status;
  
  @ManyToOne(() => Status, (status) => status.licenseToInventories)
  new_status: Status;

  @Column({ default: false })
  check: boolean;
}

export default LicenseToInventory;
