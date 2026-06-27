import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { SubProductCategoriesModule } from './sub-product-categories/sub-product-categories.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [ProductCategoriesModule, SubProductCategoriesModule],
})
export class AdminModule {}
