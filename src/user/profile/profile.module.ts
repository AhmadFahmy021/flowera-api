import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsModule } from 'src/guards/guards.module';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

import { User } from 'src/database/entities/user.entity';
import { Profile } from 'src/database/entities/profile.entity';
import { Seller } from 'src/database/entities/seller.entity';

import { CommonModule } from 'src/common/common.module';
import { RoleService } from 'src/guards/roles.service';

@Module({
  controllers: [ProfileController ],
  providers: [ProfileService],
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      Seller,
    ]),
    CommonModule,
    GuardsModule,
  ],
})
export class ProfileModule {}
