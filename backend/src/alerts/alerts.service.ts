import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminAlert } from '../entities/admin-alert.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(AdminAlert)
    private readonly alertRepo: Repository<AdminAlert>,
  ) {}

  findUnresolved() {
    return this.alertRepo.find({ where: { isResolved: false }, order: { createdAt: 'DESC' } });
  }

  async resolve(id: number, resolvedByUserId?: number) {
    await this.alertRepo.update({ id }, { isResolved: true, resolvedByUserId: resolvedByUserId ?? null });
    return this.alertRepo.findOne({ where: { id } });
  }

  async confirm(id: number, status?: string, resolvedByUserId?: number) {
    await this.alertRepo.update(
      { id },
      { isResolved: true, resolvedByUserId: resolvedByUserId ?? null, message: status ? `Confirmed: ${status}` : undefined },
    );
    return this.alertRepo.findOne({ where: { id } });
  }
}