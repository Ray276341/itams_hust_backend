import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
  } from 'typeorm';
import License from './license.entity';
import Asset from './asset.entity';
  
  @Entity()
  export class SoftwareUsage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => License, (license) => license.softwareUsages)
    license: License;
  
    @ManyToOne(() => Asset, (asset) => asset.softwareUsages)
    asset: Asset;
  
    @Column({ default: null })
    usage_metric: string;
  
    @Column({ default: null })
    usage_value: string;
  
    @Column({ default: null })
    cost: number;
  
    @Column({ type: 'timestamp', default: null })
    record_at: Date;
  
    @DeleteDateColumn({
        default: null,
    })
    deletedAt: Date;
  }
  
  export default SoftwareUsage;
  