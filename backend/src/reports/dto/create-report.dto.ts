import type { ReportType } from '../../entities/user-report.entity';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReportDto {
  @IsInt()
  rideId: number;

  @IsEnum(['status_mismatch', 'wait_time_mismatch', 'safety'])
  reportType: ReportType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;

  @IsString()
  @IsNotEmpty()
  guestDeviceHash: string;
}