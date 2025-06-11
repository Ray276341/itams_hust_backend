import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
  } from 'typeorm';
import Service from './service.entity';
import UserEntity from './user.entity';
  
  @Entity()
  export class ServiceUsage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Service, (service) => service.serviceUsages)
    service: Service;
  
    @ManyToOne(() => UserEntity, (user) => user.serviceUsages)
    user: UserEntity;
  
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
  
  export default ServiceUsage;
  