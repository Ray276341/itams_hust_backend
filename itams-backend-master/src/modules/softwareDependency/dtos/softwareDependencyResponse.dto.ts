export class SoftwareDependencyResponseDto {
    id: number;
    licenseId: number;
    licenseName: string;
    dependencyId: number;
    dependencyName: string;
    relationshipId: number;
    relationshipName: string;
    note?: string | null;
    deletedAt?: Date | null;
  }