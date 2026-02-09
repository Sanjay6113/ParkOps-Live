import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RidesService, UpsertRideDto, UpdateRideStatusDto, BatchCloseDto } from './rides.service';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Get()
  findAll(@Query('visible') visible?: string) {
    if (visible === 'true') return this.ridesService.findVisible();
    return this.ridesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ridesService.findOne(id);
  }

  @Post()
  create(@Body() dto: UpsertRideDto) {
    return this.ridesService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<UpsertRideDto>) {
    return this.ridesService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRideStatusDto) {
    return this.ridesService.updateStatus(id, dto);
  }

  @Post('zones/close')
  batchClose(@Body() dto: BatchCloseDto) {
    return this.ridesService.batchUpdateZone(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ridesService.remove(id);
  }
}
