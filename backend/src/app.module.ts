import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RidesModule } from './rides/rides.module';
import { ReportsModule } from './reports/reports.module';
import { AlertsModule } from './alerts/alerts.module';
import { Ride } from './entities/ride.entity';
import { UserReport } from './entities/user-report.entity';
import { AdminAlert } from './entities/admin-alert.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'parkops',
      entities: [Ride, UserReport, AdminAlert],
      synchronize: true,
    }),
    RidesModule,
    ReportsModule,
    AlertsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
