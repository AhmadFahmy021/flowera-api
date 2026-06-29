import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesController } from './product-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from 'src/database/entities/seller.entity';
import { ProducCategories } from 'src/database/entities/prouct-categories.entity';
import { CommonModule } from 'src/common/common.module';
import { GuardsModule } from 'src/guards/guards.module';
import { SubProductCategories } from 'src/database/entities/sub-product_categories.entity';
import { Product } from 'src/database/entities/product.entity';

@Module({
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
  imports: [
    TypeOrmModule.forFeature([Seller, ProducCategories, SubProductCategories, Product]),
    CommonModule,
    GuardsModule
  ]
})
export class ProductCategoriesModule {}
