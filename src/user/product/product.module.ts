import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from 'src/database/entities/seller.entity';
import { Store } from 'src/database/entities/store.entity';
import { Product } from 'src/database/entities/product.entity';
import { ProductImage } from 'src/database/entities/product-image.entity';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { AddonProduct } from 'src/database/entities/addon-product.entity';
import { ProducCategories } from 'src/database/entities/prouct-categories.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    TypeOrmModule.forFeature([Store, Product, ProductImage, ProductVariant, AddonProduct, ProducCategories])
  ]
})
export class ProductModule {}
