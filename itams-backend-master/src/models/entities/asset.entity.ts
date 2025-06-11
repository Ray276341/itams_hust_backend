import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssetMaintenance } from './assetMaintenance.entity';
import AssetModel from './assetModel.entity';
import AssetToInventory from './assetToInventory.entity';
import AssetToUser from './assetToUser.entity';
import Department from './department.entity';
import Inventory from './inventory.entity';
import LicenseToAsset from './licenseToAsset.entity';
import Status from './status.entity';
import Supplier from './supplier.entity';
import { SoftwareUsage } from './softwareUsage.entity';

@Entity()
export class Asset extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  image: string;

  @Column({ default: null })
  purchase_cost: number;

  @Column({ default: null })
  current_cost: number;

  @Column({ default: null })
  purchase_date: Date;

  @OneToMany(() => AssetToUser, (assetToUser) => assetToUser.asset, {
    cascade: ['soft-remove'],
  })
  assetToUsers: AssetToUser[];

  @OneToMany(() => LicenseToAsset, (licenseToAsset) => licenseToAsset.asset, {
    cascade: ['soft-remove'],
  })
  licenseToAssets: LicenseToAsset[];

  @OneToMany(
    () => AssetToInventory,
    (assetToInventory) => assetToInventory.asset,
    { cascade: ['soft-remove'] },
  )
  assetToInventories: AssetToInventory[];

  @OneToMany(
    () => AssetMaintenance,
    (assetMaintenance) => assetMaintenance.asset,
    { cascade: ['soft-remove'] },
  )
  assetMaintenances: AssetMaintenance[];

  @OneToMany(
    () => SoftwareUsage, 
    (usage) => usage.asset, 
    { cascade: ['soft-remove'] },
  )
  softwareUsages: SoftwareUsage[];




  @ManyToOne(() => AssetModel, (assetModel) => assetModel.assets)
  assetModel: AssetModel;

  @ManyToOne(() => Department, (department) => department.assets)
  department: Department;

  @ManyToOne(() => Status, (status) => status.assets)
  status: Status;

  @ManyToOne(() => Supplier, (supplier) => supplier.assets)
  supplier: Supplier;

  @DeleteDateColumn({
    default: null,
  })
  deletedAt: Date;
}

export default Asset;
