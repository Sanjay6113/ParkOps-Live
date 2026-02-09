import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ride } from './ride.entity';

export type ReportType = 'status_mismatch' | 'wait_time_mismatch' | 'safety';

@Entity({ name: 'user_reports' })
export class UserReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ride, (ride) => ride.reports, { onDelete: 'CASCADE' })
  ride: Ride;

  @Column()
  rideId: number;

  @Column({
    type: 'enum',
    enum: ['status_mismatch', 'wait_time_mismatch', 'safety'],
  })
  reportType: ReportType;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ length: 128 })
  guestDeviceHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
