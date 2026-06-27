import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddressController } from './address.controller';
import { AddressService } from './address.service';

import { User } from 'src/database/entities/user.entity';
import { Profile } from 'src/database/entities/profile.entity';
import { Address } from 'src/database/entities/address.entity';

import { CommonModule } from 'src/common/common.module';
import { Seller } from 'src/database/entities/seller.entity';
import { GuardsModule } from 'src/guards/guards.module';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      Address,
      Seller,
    ]),
    CommonModule,
    GuardsModule
  ],
})
export class AddressModule {}
