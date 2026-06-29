import { Module } from '@nestjs/common';
import { AdminSellerService } from './seller.service';
import { AdminSellerController } from './seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from 'src/database/entities/seller.entity';
import { User } from 'src/database/entities/user.entity';
import { Store } from 'src/database/entities/store.entity';
import { GuardsModule } from 'src/guards/guards.module';

@Module({
  controllers: [AdminSellerController],
  providers: [AdminSellerService],
  imports: [
    TypeOrmModule.forFeature([Seller, User, Store]),
    GuardsModule,
  ],
})
export class AdminSellerModule {}
