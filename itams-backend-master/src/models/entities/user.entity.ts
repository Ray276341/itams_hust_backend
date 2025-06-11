import { Exclude } from 'class-transformer';
import { DEFAULT_AVATAR } from 'src/modules/users/user.constants';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import AssetToUser from './assetToUser.entity';
import Department from './department.entity';
import Location from './location.entity';
import { RequestAsset } from './requestAssest.entity';
import SourceCodeToUser from './sourceCodeToUser.entity';
import ServiceToUser from './serviceToUser.entity';
import ServiceUsage from './serviceUsage.entity';
import { RequestLicense } from './requestLicense.entity';
import { RequestService } from './requestService.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: null,
  })
  name: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column({})
  @Exclude()
  password: string;

  @Column({ default: null })
  phone: string;

  @Column({ default: null })
  email: string;

  @Column({
    default: null,
  })
  birthday: Date;

  @Column({
    default: DEFAULT_AVATAR,
  })
  avatar: string;

  @ManyToOne(() => Department, (department) => department.users)
  department: Department;

  @OneToMany(() => AssetToUser, (assetToUser) => assetToUser.user, {
    cascade: ['soft-remove'],
  })
  assetToUsers: AssetToUser[];

  @OneToMany(() => ServiceToUser, (serviceToUser) => serviceToUser.user, {
    cascade: ['soft-remove'],
  })
  serviceToUsers: ServiceToUser[];

  @OneToMany(
    () => SourceCodeToUser,
    (sourceCodeToUser) => sourceCodeToUser.user,
    { cascade: ['soft-remove'] },
  )
  sourceCodeToUsers: SourceCodeToUser[];

  @OneToMany(() => RequestAsset, (requestAsset) => requestAsset.user, {
    cascade: ['soft-remove'],
  })
  requestAssets: RequestAsset[];

  @OneToMany(() => RequestLicense, (requestLicense) => requestLicense.user, {
    cascade: ['soft-remove'],
  })
  requestLicenses: RequestLicense[];

  @OneToMany(() => RequestService, (requestService) => requestService.user, {
    cascade: ['soft-remove'],
  })
  requestServices: RequestService[];

  @OneToMany(
      () => ServiceUsage, 
      (usage) => usage.user, 
      { cascade: ['soft-remove'] },
    )
    serviceUsages: ServiceUsage[];



  @DeleteDateColumn({
    default: null,
  })
  deletedAt: Date;
}

export default UserEntity;
