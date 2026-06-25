import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('user/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('detail/:productid')
  getDetailProduct(@Param('productid') product_id: number){
    return this.productService.detailProduct(product_id);
  }

  @Get('categories/:product_categories')
  getProductByCategories(@Param("product_categories") product_categories_id: number){
    return this.productService.getDataProductByCategories(product_categories_id)
  }
}
