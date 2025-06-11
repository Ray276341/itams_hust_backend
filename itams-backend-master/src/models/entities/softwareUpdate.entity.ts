import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    DeleteDateColumn
  } from 'typeorm';
  import License from './license.entity';
  
  @Entity()
  export class SoftwareUpdate extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => License, (license) => license.softwareUpdates)
    license: License;
  
    @Column({ default: null })
    version: string;
  
    @Column({ default: null })
    release_date: Date;
  
    @Column('text', { default: null })
    note: string;

    @DeleteDateColumn({
        default: null,
    })
    deletedAt: Date;
  }
  
  export default SoftwareUpdate;
  