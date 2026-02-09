import { Controller, Get, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  findUnresolved() {
    return this.alertsService.findUnresolved();
  }

  @Post(':id/resolve')
  resolve(
    @Param('id', ParseIntPipe) id: number,
    @Body('resolvedByUserId') resolvedByUserId?: number,
  ) {
    return this.alertsService.resolve(id, resolvedByUserId);
  }

  @Post(':id/confirm')
  confirm(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status?: string,
    @Body('resolvedByUserId') resolvedByUserId?: number,
  ) {
    return this.alertsService.confirm(id, status, resolvedByUserId);
  }
}
