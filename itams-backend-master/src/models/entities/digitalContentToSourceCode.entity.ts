import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import DigitalContent from './digitalContent.entity';
import SourceCode from './sourceCode.entity';

@Entity()
export class DigitalContentToSourceCode {
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

  @ManyToOne(
    () => DigitalContent,
    (digitalContent) => digitalContent.digitalContentToSourceCodes,
  )
  digitalContent: DigitalContent;

  @ManyToOne(
    () => SourceCode,
    (sourceCode) => sourceCode.digitalContentToSourceCodes,
  )
  sourceCode: SourceCode;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default DigitalContentToSourceCode;
