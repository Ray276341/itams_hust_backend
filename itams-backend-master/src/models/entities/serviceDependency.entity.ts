import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
} from 'typeorm';
import Service from './service.entity';
import { Relationship } from './relationship.entity';

@Entity()
export class ServiceDependency extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Service, (service) => service.serviceDependencies)
    service: Service;

    @ManyToOne(() => Service, (service) => service.serviceDependenciesOn)
    dependency: Service;

    @ManyToOne(() => Relationship, (relationship) => relationship.relationshipServiceEntries)
    relationship: Relationship;

    @Column('text', { default: null })
    note: string;

    @DeleteDateColumn({
        default: null,
    })
    deletedAt: Date;
}

export default ServiceDependency;
  