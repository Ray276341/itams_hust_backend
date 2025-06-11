import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import Asset from './asset.entity';
import { License } from './license.entity';

@Entity()
export class LicenseToAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  checkout_date: Date;

  @Column({ default: null })
  checkout_note: string;

  @Column({ default: null })
  checkin_date: Date;

  @Column({ default: null })
  checkin_note: string;

  @ManyToOne(() => License, (license) => license.licenseToAssets)
  license: License;

  @ManyToOne(() => Asset, (asset) => asset.licenseToAssets)
  asset: Asset;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default LicenseToAsset;
