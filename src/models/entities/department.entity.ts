import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
} from 'typeorm';
import Asset from './asset.entity';
import Inventory from './inventory.entity';
import Location from './location.entity';
import UserEntity from './user.entity';

@Entity()
export class Department extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @OneToMany(() => Asset, (asset) => asset.department)
  assets: Asset[];

  @OneToMany(() => Inventory, (inventory) => inventory.department)
  inventories: Inventory[];

  @OneToMany(() => UserEntity, (userEntity) => userEntity.department)
  users: UserEntity[];

  @ManyToOne(() => Location, (location) => location.departments)
  location: Location;
}

export default Department;
