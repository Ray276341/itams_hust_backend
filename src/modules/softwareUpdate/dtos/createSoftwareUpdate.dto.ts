export class CreateSoftwareUpdateDto {
  licenseId: number;
  version: string;
  release_date: Date;
  note?: string;
}