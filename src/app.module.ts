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
    AddressModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
