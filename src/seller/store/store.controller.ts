import { Body, Controller, Get, Post, Put, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { StoreCreateDto, StoreUpdateDto } from './store.dto';
import { UploadFile } from 'src/common/decorators/upload-file.decorator';

@Controller('seller/store')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('create')
  create(@Req() req, @Body() dto: StoreCreateDto  ){
    const userId = req.user.uid;
    return this.storeService.create(userId, dto)
  }

  @Put('update')
  @Roles('seller')
  update(@Req() req, @Body() dto: StoreUpdateDto){
    const seller_id = req.user.sid;
    return this.storeService.update(seller_id, dto);
    
  }

  @Post('upload/logo')
  @Roles('seller')
  @UploadFile('stores')
  uploadLogo(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const seller_id = req.user.sid;
    return this.storeService.upload(seller_id, file);
  }

  @Get("detail")
  @Roles("seller")
  detail(@Req() req){
    const seller_id = req.user.sid;
    return this.storeService.detail(seller_id);    
  }

}
