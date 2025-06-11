export class CreateServiceUpdateDto {
  serviceId: number;
  version: string;
  release_date: Date;
  note?: string;
}