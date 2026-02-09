import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ride } from './ride.entity';

export type AlertSeverity = 'info' | 'warning' | 'critical';

@Entity({ name: 'admin_alerts' })
export class AdminAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ride, (ride) => ride.alerts, { onDelete: 'CASCADE' })
  ride: Ride;

  @Column()
  rideId: number;

  @Column({
    type: 'enum',
    enum: ['info', 'warning', 'critical'],
    default: 'warning',
  })
  severity: AlertSeverity;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  isResolved: boolean;

  @Column({ type: 'int', nullable: true })
  resolvedByUserId: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
