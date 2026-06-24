import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('user/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('detail/:productid')
  getDetailProduct(@Param('productid') product_id: number){
    return this.productService.detailProduct(product_id);
  }
}
