
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class ServiceDependencyDto {
  @ValidateIf((_, val) => val !== undefined)
  @IsInt()
  @Min(1)
  serviceId?: number;

  @ValidateIf((_, val) => val !== undefined)
  @IsInt()
  @Min(1)
  dependencyId?: number;

  @ValidateIf((_, val) => val !== undefined)
  @IsInt()
  @Min(1)
  relationshipId?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
