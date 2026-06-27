import { Module } from '@nestjs/common';
import { SubProductCategoriesService } from './sub-product-categories.service';
import { SubProductCategoriesController } from './sub-product-categories.controller';

@Module({
  controllers: [SubProductCategoriesController],
  providers: [SubProductCategoriesService],
})
export class SubProductCategoriesModule {}
