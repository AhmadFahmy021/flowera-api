import { Module } from '@nestjs/common';
import { AddonProductService } from './addon-product.service';
import { AddonProductController } from './addon-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from 'src/database/entities/seller.entity';
import { AddonProduct } from 'src/database/entities/addon-product.entity';
import { ProductImage } from 'src/database/entities/product-image.entity';
import { CommonModule } from 'src/common/common.module';
import { Product } from 'src/database/entities/product.entity';
import { ProductVariant } from 'src/database/entities/product-variant.entity';

@Module({
  controllers: [AddonProductController],
  providers: [AddonProductService],
  imports: [
    TypeOrmModule.forFeature([Seller, AddonProduct, ProductImage, Product, ProductVariant]),
    CommonModule
  ]
})
export class AddonProductModule {}
