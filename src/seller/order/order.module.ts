import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SellerOrderController } from './order.controller';
import { OrderService } from './order.service';

import { Order } from 'src/database/entities/order.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { OrderImageConfirmed } from 'src/database/entities/order-image-confirmed.entity';

import { CommonModule } from 'src/common/common.module';
import { GuardsModule } from 'src/guards/guards.module';

@Module({
  controllers: [SellerOrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, OrderImageConfirmed]),
    CommonModule,
    GuardsModule,
  ],
})
export class OrderModule {}
