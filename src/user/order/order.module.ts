import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

import { User } from 'src/database/entities/user.entity';
import { Order } from 'src/database/entities/order.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { Product } from 'src/database/entities/product.entity';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { Store } from 'src/database/entities/store.entity';
import { PaymentOrder } from 'src/database/entities/payment-order.entity';
import { OrderImageConfirmed } from 'src/database/entities/order-image-confirmed.entity';
import { Address } from 'src/database/entities/address.entity';

import { CommonModule } from 'src/common/common.module';
import { GuardsModule } from 'src/guards/guards.module';
import { ShippingModule } from 'src/shipping/shipping.module';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PaymentService],
  imports: [
    TypeOrmModule.forFeature([
      User,
      Order,
      OrderItem,
      Product,
      ProductVariant,
      Store,
      PaymentOrder,
      OrderImageConfirmed,
      Address,
    ]),
    CommonModule,
    GuardsModule,
    ShippingModule
  ],
})
export class OrderModule {}
