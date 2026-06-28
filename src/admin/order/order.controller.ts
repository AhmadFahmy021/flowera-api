import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { OrderService } from './order.service';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';

import { UpdateOrderStatusDto } from './order.dto';

@Controller('admin/order')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  @Roles('admin')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }
}
