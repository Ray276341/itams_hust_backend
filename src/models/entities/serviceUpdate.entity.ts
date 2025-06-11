import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    DeleteDateColumn
  } from 'typeorm';
  import Service from './service.entity';
  
  @Entity()
  export class ServiceUpdate extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Service, (service) => service.serviceUpdates)
    service: Service;
  
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
  
  export default ServiceUpdate;
  