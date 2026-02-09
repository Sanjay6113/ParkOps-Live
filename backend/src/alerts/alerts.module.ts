import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { AdminAlert } from '../entities/admin-alert.entity';
import { Ride } from '../entities/ride.entity';
import { AlertsGateway } from './alerts.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([AdminAlert, Ride])],
  providers: [AlertsService, AlertsGateway],
  controllers: [AlertsController],
})
export class AlertsModule {}
