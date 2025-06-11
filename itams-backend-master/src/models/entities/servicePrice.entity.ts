import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
  } from 'typeorm';
  import { Service } from './service.entity';
  
  @Entity()
  export class ServicePrice extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Service, (service) => service.servicePrices)
    service: Service;

    @Column({ default: null })
    purchase_cost: number;

    @Column({ default: null })
    purchase_date: Date;

    @Column({ default: null })
    expiration_date: Date;

    @Column({ default: null })
    pricing_model: string;
  
    @Column({ default: null })
    unit: string; // e.g., 'GB', 'user', 'hour'
  
    @Column({ default: null })
    unit_price: number; // in VND
  
    @Column('text', { nullable: true })
    description: string;
  
    @DeleteDateColumn({ default: null })
    deletedAt: Date;
  }
  
  export default ServicePrice;