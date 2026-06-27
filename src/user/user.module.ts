import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HomeModule } from './home/home.module';
import { ProductModule } from './product/product.module';
import { ProfileModule } from './profile/profile.module';
import { AddressModule } from '../address/address.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    HomeModule,
    ProductModule,
    ProfileModule,
    AddressModule,
  ]
})
export class UserModule {}

