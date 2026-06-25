import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantCreateDto, ProductVariantUpdateDto } from './product-variant.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UploadFile } from 'src/common/decorators/upload-file.decorator';

@Controller('seller/product-variant')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("seller")
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Get("")
  getDataByProduct(@Req() req, @Body("product") product_id: number){
    const seller_id = req.user.sid;
    return this.productVariantService.getAllDataProductVariantByProductId(seller_id, product_id)
  }
  @Post("create")
  @UploadFile("variants")
  create(@Body() dto: ProductVariantCreateDto, @UploadedFile() file: Express.Multer.File){
    return this.productVariantService.create(dto.product_id, dto, file);
  }
  @Put("update/:product_variant_id")
  @UploadFile("variants")
  update(@Param("product_variant_id") param, @Body() dto: ProductVariantUpdateDto, @UploadedFile() file: Express.Multer.File){
    return this.productVariantService.update(param, dto, file);
  }
  @Delete("delete/:product_variant_id")
  delete(@Param("product_variant_id") param){
    return this.productVariantService.deleted(param)
  }
}
