import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Asset from './asset.entity';
import AssetModel from './assetModel.entity';
import License from './license.entity';
import Service from './service.entity';

@Entity()
export class Manufacturer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  image: string;

  @OneToMany(() => AssetModel, (assetModel) => assetModel.manufacturer)
  assetModels: AssetModel[];

  @OneToMany(() => License, (license) => license.manufacturer)
  licenses: License[];

  @OneToMany(() => Service, (service) => service.manufacturer)
    services: Service[];
}

export default Manufacturer;
