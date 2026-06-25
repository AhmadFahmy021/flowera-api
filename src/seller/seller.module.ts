import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { AddonProductModule } from './addon-product/addon-product.module';

@Module({
  controllers: [SellerController],
  providers: [SellerService],
  imports: [StoreModule, ProductModule, ProductVariantModule, AddonProductModule],
})
export class SellerModule {}
