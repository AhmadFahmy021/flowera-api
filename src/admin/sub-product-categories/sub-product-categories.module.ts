import { Module } from '@nestjs/common';
import { SubProductCategoriesService } from './sub-product-categories.service';
import { SubProductCategoriesController } from './sub-product-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubProductCategories } from 'src/database/entities/sub-product_categories.entity';
import { CommonModule } from 'src/common/common.module';
import { Product } from 'src/database/entities/product.entity';

@Module({
  controllers: [SubProductCategoriesController],
  providers: [SubProductCategoriesService],
  imports: [
    TypeOrmModule.forFeature([SubProductCategories, Product]),
    CommonModule
  ]
})
export class SubProductCategoriesModule {}
