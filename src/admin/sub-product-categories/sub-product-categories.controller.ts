import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SubProductCategoriesService } from './sub-product-categories.service';
import { SubProductCategoriesCreateDto, SubProductCategoriesUpdateDto } from './sub-product-categories.dto';

@Controller('admin/sub-product-categories')
export class SubProductCategoriesController {
  constructor(private readonly subProductCategoriesService: SubProductCategoriesService) {}
  
  @Get("")
  getDataAll(){
    return this.subProductCategoriesService.getAllData()
  }

  @Post("create")
  create(@Body() dto: SubProductCategoriesCreateDto){
    return this.subProductCategoriesService.create(dto)
  }

  @Put("update/:sub_product_categories_id")
  update(@Param("sub_product_categories_id") param: number, @Body() dto: SubProductCategoriesUpdateDto){
    return this.subProductCategoriesService.update(param, dto)
  }

  @Delete("delete/:sub_product_categories_id")
  delete(@Param("sub_product_categories_id") param: number){
    console.log(param);
    
    return this.subProductCategoriesService.deleted(param)
  }
}
