import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from '../entities/ride.entity';

export type UpsertRideDto = {
  name: string;
  zone: string;
  status?: Ride['status'];
  capacityPerHour: number;
  currentWaitTime?: number | null;
  isVisible?: boolean;
  allowGuestReports?: boolean;
  x: number;
  y: number;
};
export type UpdateRideStatusDto = { status: Ride['status']; waitTime?: number | null };
export type BatchCloseDto = { zone: string; status: Ride['status'] };

@Injectable()
export class RidesService {
  constructor(
    @InjectRepository(Ride)
    private readonly rideRepo: Repository<Ride>,
  ) {}

  findAll() {
    return this.rideRepo.find();
  }

  findVisible() {
    return this.rideRepo.find({ where: { isVisible: true } });
  }

  findOne(id: number) {
    return this.rideRepo.findOne({ where: { id } });
  }

  async create(dto: UpsertRideDto) {
    const ride = this.rideRepo.create({
      ...dto,
      status: dto.status ?? 'operational',
      isVisible: dto.isVisible ?? true,
      allowGuestReports: dto.allowGuestReports ?? true,
      currentWaitTime: dto.currentWaitTime ?? null,
    });
    return this.rideRepo.save(ride);
  }

  async update(id: number, dto: Partial<UpsertRideDto>) {
    await this.rideRepo.update({ id }, dto);
    return this.findOne(id);
  }

  async updateStatus(id: number, dto: UpdateRideStatusDto) {
    await this.rideRepo.update({ id }, { status: dto.status, currentWaitTime: dto.waitTime ?? null });
    return this.findOne(id);
  }

  async batchUpdateZone(dto: BatchCloseDto) {
    await this.rideRepo.update({ zone: dto.zone }, { status: dto.status });
    return this.rideRepo.find({ where: { zone: dto.zone } });
  }

  async remove(id: number) {
    await this.rideRepo.delete(id);
    return { deleted: true };
  }
}
