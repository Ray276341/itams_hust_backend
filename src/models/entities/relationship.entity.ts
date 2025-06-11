import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import ServiceDependency from './serviceDependency.entity';
import SoftwareDependency from './softwareDependency.entity';

@Entity()
export class Relationship extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @OneToMany(
    () => ServiceDependency,
    (dep) => dep.relationship
  )
  relationshipServiceEntries: ServiceDependency[];

  @OneToMany(
    () => SoftwareDependency,
    (dep) => dep.relationship
  )
  relationshipLicenseEntries: ServiceDependency[];
}
