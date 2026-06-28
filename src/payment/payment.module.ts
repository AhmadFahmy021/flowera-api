import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentOrder } from 'src/database/entities/payment-order.entity';
import { Order } from 'src/database/entities/order.entity';
import { PaymentScheduler } from './payment.scheduler';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([PaymentOrder, Order])
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentScheduler],
  exports: [PaymentService],
})
export class PaymentModule {}
