import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { ProductCategoriesCreateDto, ProductCategoriesUpdateDto } from './product-categories.dto';

@Controller('admin/product-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ProductCategoriesController {
  constructor(private readonly productCategoriesService: ProductCategoriesService) {}

  @Get("")
  getData(){
    return this.productCategoriesService.getDataAll();
  }

  @Post('create')
  create(@Body() dto: ProductCategoriesCreateDto){
    return this.productCategoriesService.create(dto)
  }
  @Put("update/:product_categories_id")
  update(@Param("product_categories_id") product_categories_id: number, @Body() dto:  ProductCategoriesUpdateDto){
    return this.productCategoriesService.update(product_categories_id, dto)
  }

  @Delete("delete/:product_categories_id")
  deleted(@Param("product_categories_id") param: number){
    return this.productCategoriesService.deleted(param)
  }
}
