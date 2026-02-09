import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { RideStatus } from '../../entities/ride.entity';

export class UpsertRideDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  zone: string;

  @IsOptional()
  @IsEnum(['operational', 'maintenance', 'closed', 'inspection'])
  status?: RideStatus;

  @IsInt()
  @IsPositive()
  capacityPerHour: number;

  @IsOptional()
  @IsInt()
  currentWaitTime?: number | null;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsBoolean()
  allowGuestReports?: boolean;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}

export class UpdateRideStatusDto {
  @IsEnum(['operational', 'maintenance', 'closed', 'inspection'])
  status: RideStatus;

  @IsOptional()
  @IsInt()
  waitTime?: number | null;
}

export class BatchCloseDto {
  @IsString()
  @IsNotEmpty()
  zone: string;

  @IsEnum(['operational', 'maintenance', 'closed', 'inspection'])
  status: RideStatus;
}