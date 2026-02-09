import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserReport } from './user-report.entity';
import { AdminAlert } from './admin-alert.entity';

export type RideStatus =
  | 'operational'
  | 'maintenance'
  | 'closed'
  | 'inspection';

@Entity({ name: 'rides' })
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 120 })
  zone: string;

  @Column({
    type: 'enum',
    enum: ['operational', 'maintenance', 'closed', 'inspection'],
    default: 'operational',
  })
  status: RideStatus;

  @Column({ type: 'int', default: 0 })
  capacityPerHour: number;

  @Column({ type: 'int', nullable: true })
  currentWaitTime: number | null;

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ type: 'boolean', default: true })
  allowGuestReports: boolean;

  @Column({ type: 'int' })
  x: number;

  @Column({ type: 'int' })
  y: number;

  @OneToMany(() => UserReport, (report) => report.ride)
  reports: UserReport[];

  @OneToMany(() => AdminAlert, (alert) => alert.ride)
  alerts: AdminAlert[];
}
