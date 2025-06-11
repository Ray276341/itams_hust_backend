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
export class RequestLicense {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @Column({ default: 'Requested' })
  status: string;

  @Column({ default: null })
  licenseId: number;

  @Column({ default: null })
  assetId: number;

  @ManyToOne(() => Category, (category) => category.requestLicenses)
  category: Category;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.requestLicenses)
  user: UserEntity;

  @Column({ default: null })
  note: string;
}
