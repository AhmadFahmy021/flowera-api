import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HomeModule } from './home/home.module';
import { ProductModule } from './product/product.module';
import { User } from 'src/database/entities/user.entity';
import { Profile } from 'src/database/entities/profile.entity';
import { Address } from 'src/database/entities/address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Address]),
    HomeModule,
    ProductModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
