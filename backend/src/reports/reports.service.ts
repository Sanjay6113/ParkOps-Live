import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { CreateReportDto } from './dto/create-report.dto';
import { UserReport } from '../entities/user-report.entity';
import { Ride } from '../entities/ride.entity';
import { AdminAlert } from '../entities/admin-alert.entity';
import { AlertsGateway } from '../alerts/alerts.gateway';

const TEN_MINUTES = 10 * 60;
const WARNING_THRESHOLD = 5;
const CRITICAL_THRESHOLD = 20;
export const REDIS_CLIENT = 'REDIS_CLIENT';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(UserReport)
    private readonly reportRepo: Repository<UserReport>,
    @InjectRepository(Ride)
    private readonly rideRepo: Repository<Ride>,
    @InjectRepository(AdminAlert)
    private readonly alertRepo: Repository<AdminAlert>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly alertsGateway: AlertsGateway,
  ) {}

  async create(dto: CreateReportDto) {
    const ride = await this.rideRepo.findOne({ where: { id: dto.rideId } });
    if (!ride) throw new Error('Ride not found');

    const deviceKey = `report:device:${dto.rideId}:${dto.guestDeviceHash}`;
    const countKey = `report:count:${dto.rideId}`;

    const already = await this.redis.get(deviceKey);
    if (already) {
      return { accepted: false, reason: 'duplicate_within_window' };
    }

    // mark device for 10 minutes
    await this.redis.set(deviceKey, '1', 'EX', TEN_MINUTES, 'NX');
    // increment count
    const count = await this.redis.incr(countKey);
    await this.redis.expire(countKey, TEN_MINUTES);

    const report = this.reportRepo.create({
      rideId: dto.rideId,
      reportType: dto.reportType,
      message: dto.message,
      guestDeviceHash: dto.guestDeviceHash,
    });
    await this.reportRepo.save(report);

    // threshold logic
    if (count === WARNING_THRESHOLD) {
      const alert = await this.raiseAlert(ride, 'warning', 'User mismatch alert threshold reached');
      this.alertsGateway.broadcastAlert(alert);
    }
    if (count === CRITICAL_THRESHOLD) {
      const alert = await this.raiseAlert(ride, 'critical', 'Critical threshold reached; auto set to inspection');
      this.alertsGateway.broadcastAlert(alert);
      await this.rideRepo.update({ id: ride.id }, { status: 'inspection' });
    }

    return { accepted: true, count };
  }

  async raiseAlert(ride: Ride, severity: 'info' | 'warning' | 'critical', message: string) {
    const alert = this.alertRepo.create({ rideId: ride.id, severity, message });
    return this.alertRepo.save(alert);
  }
}
