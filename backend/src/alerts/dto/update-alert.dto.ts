import { IsOptional, IsEnum, IsInt } from 'class-validator';

export class UpdateAlertDto {
  @IsOptional()
  @IsEnum(['OPEN', 'INVESTIGATING', 'RESOLVED'])
  status?: string;

  @IsOptional()
  @IsInt()
  assignedTo?: number | null;
}
