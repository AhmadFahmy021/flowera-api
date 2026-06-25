import { Module } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantController } from './product-variant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { Store } from 'src/database/entities/store.entity';
import { Product } from 'src/database/entities/product.entity';
import { CommonModule } from 'src/common/common.module';
import { ProductImage } from 'src/database/entities/product-image.entity';
import { Seller } from 'src/database/entities/seller.entity';

@Module({
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  imports: [
    TypeOrmModule.forFeature([ProductVariant, Store, Product, ProductImage, Seller]),
    CommonModule
  ]
})
export class ProductVariantModule {}
