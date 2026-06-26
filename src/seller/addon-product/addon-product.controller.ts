import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards } from '@nestjs/common';
import { AddonProductService } from './addon-product.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { AddOnProductCreateDto, AddProductUpdateDto } from './addon-product.dto';
import { UploadFile } from 'src/common/decorators/upload-file.decorator';

@Controller('seller/addon-product')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("seller")
export class AddonProductController {
  constructor(private readonly addonProductService: AddonProductService) {}

  @Get("")
  getData(@Body("product") product_id: number){
    return this.addonProductService.getDataByProduct(product_id)
  }

  @Post("create")
  @UploadFile("addon")
  create(@Body() dto: AddOnProductCreateDto, @UploadedFile() file: Express.Multer.File){
    return this.addonProductService.create(dto, file)
  }

  @Put("update/:addon_product")
  @UploadFile("addon")
  update(@Param("addon_product") addon_product_id: number, @Body() dto: AddProductUpdateDto, @UploadedFile() file: Express.Multer.File){
    return this.addonProductService.update(addon_product_id, dto, file)
  }

  @Delete('delete/:addon_product')
  @UploadFile("addon")
  delete(@Param("addon_product") param: number){
    return this.addonProductService.deleted(param)
  }
}
