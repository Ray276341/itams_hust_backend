import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import SourceCode from './sourceCode.entity';
import UserEntity from './user.entity';

@Entity()
export class SourceCodeToUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  start_date: Date;

  @Column({ default: null })
  start_note: string;

  @Column({ default: null })
  end_date: Date;

  @Column({ default: null })
  end_note: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.sourceCodeToUsers)
  user: UserEntity;

  @ManyToOne(() => SourceCode, (sourceCode) => sourceCode.sourceCodeToUsers)
  sourceCode: SourceCode;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default SourceCodeToUser;
