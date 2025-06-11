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
import LicenseToAsset from './licenseToAsset.entity';
import Manufacturer from './manufacturer.entity';
import Supplier from './supplier.entity';

import SoftwareDependency from './softwareDependency.entity';
import SoftwareUpdate from './softwareUpdate.entity';
import SoftwareUsage from './softwareUsage.entity';
import LicenseToInventory from './licenseToInventory.entity';
import Status from './status.entity';

@Entity()
export class License extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  version: string;

  @Column('text', { default: null })
  description: string;

  @Column({ default: null })
  key: string;

  @Column({ default: null })
  license_link: string;

  @Column({ default: null })
  type: string;

  @Column({ default: null })
  purchase_cost: number;

  @Column({ default: null })
  current_cost: number;

  @Column({ default: null })
  purchase_date: Date;

  @Column({ default: null })
  expiration_date: Date;

  @Column()
  seats: number;

  @OneToMany(() => LicenseToAsset, (licenseToAsset) => licenseToAsset.license, {
    cascade: ['soft-remove'],
  })
  licenseToAssets: LicenseToAsset[];

  @OneToMany(() => SoftwareUsage, (usage) => usage.license, {
    cascade: ['soft-remove'],
  })
  softwareUsages: SoftwareUsage[];

  @OneToMany(() => SoftwareDependency, (dep) => dep.license, {
    cascade: ['soft-remove'],
  })
  softwareDependencies: SoftwareDependency[];

  @OneToMany(() => SoftwareDependency, (dep) => dep.dependency, {
    cascade: ['soft-remove'],
  })
  softwareDependenciesOn: SoftwareDependency[];

  @OneToMany(() => SoftwareUpdate, (update) => update.license, {
    cascade: ['soft-remove'],
  })
  softwareUpdates: SoftwareUpdate[];

  @OneToMany(
    () => LicenseToInventory,
    (licenseToInventory) => licenseToInventory.license,
    { cascade: ['soft-remove'] },
  )
  licenseToInventories: LicenseToInventory[];

  @ManyToOne(() => Status, (status) => status.licenses)
  status: Status;

  @ManyToOne(() => Category, (category) => category.licenses)
  category: Category;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.licenses)
  manufacturer: Manufacturer;

  @ManyToOne(() => Supplier, (supplier) => supplier.licenses)
  supplier: Supplier;

  @DeleteDateColumn({
    default: null,
  })
  deletedAt: Date;
}

export default License;
