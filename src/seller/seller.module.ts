import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';

@Module({
  controllers: [SellerController],
  providers: [SellerService],
  imports: [StoreModule, ProductModule],
})
export class SellerModule {}
