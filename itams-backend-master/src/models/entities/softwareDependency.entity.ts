import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
} from 'typeorm';
import License from './license.entity';
import { Relationship } from './relationship.entity';

@Entity()
export class SoftwareDependency extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => License, (license) => license.softwareDependencies)
    license: License;

    @ManyToOne(() => License, (license) => license.softwareDependenciesOn)
    dependency: License;

    @ManyToOne(() => Relationship, (relationship) => relationship.relationshipLicenseEntries)
    relationship: Relationship;

    @Column('text', { default: null })
    note: string;

    @DeleteDateColumn({
        default: null,
    })
    deletedAt: Date;
}

export default SoftwareDependency;
  