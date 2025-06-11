import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Asset from './asset.entity';
import AssetToInventory from './assetToInventory.entity';
import License from './license.entity';
import Service from './service.entity';
import LicenseToInventory from './licenseToInventory.entity';
import ServiceToInventory from './serviceToInventory.entity';

@Entity()
export class Status extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: '#666' })
  color: string;

  @OneToMany(() => Asset, (asset) => asset.status)
  assets: Asset[];

  @OneToMany(() => License, (license) => license.status)
  licenses: License[];

  @OneToMany(() => Service, (service) => service.status)
  services: Service[];

  @OneToMany(
    () => AssetToInventory,
    (assetToInventory) => assetToInventory.new_status,
  )
  assetToInventories: AssetToInventory[];

  @OneToMany(
    () => LicenseToInventory,
    (licenseToInventory) => licenseToInventory.new_status,
  )
  licenseToInventories: LicenseToInventory[];

  @OneToMany(
    () => ServiceToInventory,
    (serviceToInventory) => serviceToInventory.new_status,
  )
  serviceToInventories: ServiceToInventory[];
}

export default Status;
