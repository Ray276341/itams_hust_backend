export class ServiceDependencyResponseDto {
    id: number;
    serviceId: number;
    serviceName: string;
    dependencyId: number;
    dependencyName: string;
    relationshipId: number;
    relationshipName: string;
    note?: string | null;
    deletedAt?: Date | null;
  }