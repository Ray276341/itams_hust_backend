import { IsBoolean } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import DigitalContentToSourceCode from './digitalContentToSourceCode.entity';

@Entity()
export class DigitalContent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: null,
  })
  name: string;

  @Column({
    default: null,
  })
  owner: string;

  @Column({
    default: null,
  })
  description: string;

  @Column({
    default: false,
  })
  @IsBoolean()
  isPrivate: boolean;

  @Column({
    default: null,
  })
  url: string;

  @OneToMany(
    () => DigitalContentToSourceCode,
    (digitalContentToSourceCode) => digitalContentToSourceCode.digitalContent,
    { cascade: ['soft-remove'] },
  )
  digitalContentToSourceCodes: DigitalContentToSourceCode[];

  @DeleteDateColumn({
    default: null,
  })
  deletedAt: Date;
}

export default DigitalContent;
