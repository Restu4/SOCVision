import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryLogDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  severity?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEnum([
    'LOGIN_SUCCESS', 'LOGIN_FAILED', 'PASSWORD_RESET',
    'ROLE_CHANGE', 'ACCESS_DENIED', 'VPN_CONNECT',
    'VPN_DISCONNECT', 'FILE_DOWNLOAD', 'EMAIL_SENT', 'CONFIG_CHANGE',
  ])
  eventType?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;
}
