import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';

import { OrderService } from './order.service';

import { UploadFile } from 'src/common/decorators/upload-file.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';

import { UpdateOrderStatusDto } from './order.dto';

@Controller('seller/order')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SellerOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles('seller')
  findAllByStore(@Req() req) {
    const storeId = req.user.sid;
    return this.orderService.findAllByStore(storeId);
  }

  @Get(':id')
  @Roles('seller')
  findOne(@Req() req, @Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  @Roles('seller')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }

  @Post(':id/upload-image')
  @Roles('seller')
  @UploadFile('orders/confirm')
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('note') note?: string,
  ) {
    if (!file) {
      throw new Error('Image file is required');
    }
    return this.orderService.uploadOrderImage(id, file, note);
  }
}
