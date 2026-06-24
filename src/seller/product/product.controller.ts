import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UploadedFiles, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ProductCreateDto, ProductUpdateDto } from './product.dto';
import { UploadFile } from 'src/common/decorators/upload-file.decorator';
import { UploadFiles } from 'src/common/decorators/upload-files.decorator';

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
  create(@Req() req, @Query('sub_categories') param, @Body() dto: ProductCreateDto){
    const seller_id = req.user.sid;
    return this.productService.create(seller_id, dto, param)
  }
  
  @Put('update')
  update(@Query('product') product_id: number, @Body() dto: ProductUpdateDto){
    return this.productService.update(product_id, dto)
  }

  @Delete('delete')
  delete(@Query('product') product_id: number){
    return this.productService.delete(product_id);
  }

  @Post(':product_id/images')
  @UploadFiles('products')
  uploadImages(
      @Param('product_id')
      product_id: number,

      @UploadedFiles()
      files: Express.Multer.File[],
  ){
      return this.productService.uploadImages(
          product_id,
          files,
      );
  }

  @Post('images/default/:imageProduct')
  setDefaultImage(@Param("imageProduct") image_product_id: number, @Body("product_id") product_id: number){
    return this.productService.setDefaultImage(image_product_id, product_id)
  }
}
