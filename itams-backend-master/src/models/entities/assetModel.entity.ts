import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Asset from './asset.entity';
import { Category } from './category.entity';
import Manufacturer from './manufacturer.entity';

@Entity()
export class AssetModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  image: string;

  @Column({ default: null })
  cpe: string;

  @OneToMany(() => Asset, (asset) => asset.assetModel)
  assets: Asset[];

  @ManyToOne(() => Category, (category) => category.assetModels)
  category: Category;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.assetModels)
  manufacturer: Manufacturer;
}

export default AssetModel;
