import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminOrderController } from './order.controller';
import { OrderService } from './order.service';

import { Order } from 'src/database/entities/order.entity';

import { CommonModule } from 'src/common/common.module';
import { GuardsModule } from 'src/guards/guards.module';

@Module({
  controllers: [AdminOrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([Order]),
    CommonModule,
    GuardsModule,
  ],
})
export class OrderModule {}
