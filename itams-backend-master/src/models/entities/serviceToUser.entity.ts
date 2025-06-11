import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import UserEntity from './user.entity';
import { Service } from './service.entity';

@Entity()
export class ServiceToUser {
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

  @ManyToOne(() => Service, (service) => service.serviceToUsers)
  service: Service;

  @ManyToOne(() => UserEntity, (user) => user.serviceToUsers)
  user: UserEntity;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default ServiceToUser;
