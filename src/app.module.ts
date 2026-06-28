import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SellerModule } from './seller/seller.module';
import { AdminModule } from './admin/admin.module';
import { AddressModule } from './address/address.module';
import { ShippingModule } from './shipping/shipping.module';
import { OrderModule as UserOrderModule } from './user/order/order.module';
import { OrderModule as SellerOrderModule } from './seller/order/order.module';
import { OrderModule as AdminOrderModule } from './admin/order/order.module';
import { ScheduleModule } from "@nestjs/schedule";

import { GuardsModule } from './guards/guards.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => AppDataSource.options,
    }),
    UserModule,
    AuthModule,
    SellerModule,
    AdminModule,
    AddressModule,
    ShippingModule,
    UserOrderModule,
    SellerOrderModule,
    AdminOrderModule,
    GuardsModule,
    PaymentModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
