import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import Service from './service.entity';
import Inventory from './inventory.entity';
import Status from './status.entity';

@Entity()
export class ServiceToInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.serviceToInventories)
  inventory: Inventory;

  @ManyToOne(() => Service, (service) => service.serviceToUsers)
  service: Service;

  @Column({ default: null })
  old_cost: number;

  @Column({ default: null })
  new_cost: number;

  @Column({ default: null })
  total_unit: number; 

  @Column({ default: null })
  estimated_cost: number; 

  @ManyToOne(() => Status, (status) => status.serviceToInventories)
  old_status: Status;
  
  @ManyToOne(() => Status, (status) => status.serviceToInventories)
  new_status: Status;

  @Column({ default: false })
  check: boolean;
}

export default ServiceToInventory;
