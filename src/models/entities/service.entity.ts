import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { ServicePrice } from './servicePrice.entity';
import ServiceToUser from './serviceToUser.entity';
import { ServiceType } from './serviceType.entity';

import Manufacturer from './manufacturer.entity';
import Supplier from './supplier.entity';

import ServiceDependency from './serviceDependency.entity';
import ServiceUpdate from './serviceUpdate.entity';
import ServiceUsage from './serviceUsage.entity';
import ServiceToInventory from './serviceToInventory.entity';
import Status from './status.entity';


@Entity()
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  version: string;

  @Column('text', { default: null })
  description: string;

  @Column({ default: null })
  current_cost: number;

  @Column({ default: null })
  unit: string;

  @OneToMany(() => ServicePrice, (servicePrice) => servicePrice.service, {
    cascade: ['soft-remove'],
  })
  servicePrices: ServicePrice[];

  @OneToMany(() => ServiceToUser, (serviceToUser) => serviceToUser.service, {
    cascade: ['soft-remove'],
  })
  serviceToUsers: ServiceToUser[];

  @OneToMany(() => ServiceUsage, (usage) => usage.service, {
    cascade: ['soft-remove'],
  })
  serviceUsages: ServiceUsage[];

  @OneToMany(() => ServiceDependency, (dep) => dep.service, {
    cascade: ['soft-remove'],
  })
  serviceDependencies: ServiceDependency[];

  @OneToMany(() => ServiceDependency, (dep) => dep.dependency, {
    cascade: ['soft-remove'],
  })
  serviceDependenciesOn: ServiceDependency[];

  @OneToMany(() => ServiceUpdate, (update) => update.service, {
    cascade: ['soft-remove'],
  })
  serviceUpdates: ServiceUpdate[];

  @OneToMany(
    () => ServiceToInventory,
    (serviceToInventory) => serviceToInventory.service,
    { cascade: ['soft-remove'] },
  )
  serviceToInventories: ServiceToInventory[];

  @ManyToOne(() => Status, (status) => status.services)
  status: Status;

  @ManyToOne(() => Category, (category) => category.services)
  category: Category;

  @ManyToOne(() => ServiceType, (type) => type.services)
  service_type: ServiceType;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.services)
  manufacturer: Manufacturer;

  @ManyToOne(() => Supplier, (supplier) => supplier.services)
  supplier: Supplier;

  @DeleteDateColumn({
    default: null,
  })
  deletedAt: Date;
}

export default Service;
