import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService, REDIS_CLIENT } from './reports.service';
import { ReportsController } from './reports.controller';
import { UserReport } from '../entities/user-report.entity';
import { Ride } from '../entities/ride.entity';
import { AdminAlert } from '../entities/admin-alert.entity';
import Redis from 'ioredis';

@Module({
  imports: [TypeOrmModule.forFeature([UserReport, Ride, AdminAlert])],
  providers: [
    ReportsService,
    {
      provide: REDIS_CLIENT,
      useFactory: () =>
        new Redis({
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        }),
    },
  ],
  controllers: [ReportsController],
})
export class ReportsModule {}
