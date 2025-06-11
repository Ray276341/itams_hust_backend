import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ default: null })
  itemId: number;

  @Column({ default: null })
  expiration_date: Date;

  @Column({ default: 'Asset' })
  type: string;
}
