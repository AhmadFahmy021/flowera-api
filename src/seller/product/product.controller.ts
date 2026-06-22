import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ProductCreateDto, ProductUpdateDto } from './product.dto';

@Controller('seller/product')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('seller')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('')
  getAllData(@Req() req){
    const seller_id = req.user.sid;
    return this.productService.getDataAll(seller_id)
  }

  @Post('create')
  create(@Req() req, @Param('sub_categories') param, @Body() dto: ProductCreateDto){
    const seller_id = req.user.sid;
    return this.productService.create(seller_id, dto, param)
  }
  
  @Put('update')
  update(@Param('product') product_id: number, @Body() dto: ProductUpdateDto){
    return this.productService.update(product_id, dto)
  }

  @Delete('delete')
  delete(@Param('product') product_id: number){
    return this.productService.delete(product_id);
  }
}
