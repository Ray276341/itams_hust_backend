import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Asset from './asset.entity';
import Supplier from './supplier.entity';

@Entity()
export class AssetMaintenance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Asset, (asset) => asset.assetMaintenances)
  asset: Asset;

  @ManyToOne(() => Supplier, (supplier) => supplier.assetMaintenances)
  supplier: Supplier;

  @Column({ default: null })
  start_date: Date;

  @Column({ default: null })
  end_date: Date;

  @Column({ default: null })
  cost: number;

  @Column({ default: null })
  note: string;

  @DeleteDateColumn({
    default: null,
  })
  deletedAt: Date;
}
