import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { Seller } from 'src/database/entities/seller.entity';
import { CommonModule } from 'src/common/common.module';
import { Store } from 'src/database/entities/store.entity';
import { ProductImage } from 'src/database/entities/product-image.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Product, Seller, Store, ProductImage]),
  ]
})
export class ProductModule {}
