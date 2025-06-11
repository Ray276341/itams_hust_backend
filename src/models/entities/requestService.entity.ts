import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import UserEntity from './user.entity';

@Entity()
export class RequestService {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @Column({ default: 'Requested' })
  status: string;

  @Column({ default: null })
  serviceId: number;

  @ManyToOne(() => Category, (category) => category.requestServices)
  category: Category;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.requestServices)
  user: UserEntity;

  @Column({ default: null })
  note: string;
}
