import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import AssetModel from './assetModel.entity';
import { Category } from './category.entity';
import UserEntity from './user.entity';

@Entity()
export class RequestAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @Column({ default: 'Requested' })
  status: string;

  @Column({ default: null })
  assetId: number;

  @ManyToOne(() => Category, (category) => category.requestAssets)
  category: Category;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.requestAssets)
  user: UserEntity;

  @Column({ default: null })
  note: string;
}
