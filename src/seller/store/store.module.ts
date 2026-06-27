import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from 'src/database/entities/seller.entity';
import { User } from 'src/database/entities/user.entity';
import { Store } from 'src/database/entities/store.entity';
import { RepositoryHelper } from 'src/common/helpers/repository.helper';
import { CommonModule } from 'src/common/common.module';
import { GuardsModule } from 'src/guards/guards.module';

@Module({
  controllers: [StoreController],
  providers: [StoreService, ],
  imports: [
    TypeOrmModule.forFeature([Seller, User, Store]),
    CommonModule,
    GuardsModule
  ]
})
export class StoreModule {}
