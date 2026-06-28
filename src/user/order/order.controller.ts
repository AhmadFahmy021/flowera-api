import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { OrderService } from './order.service';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';

import { CheckoutDto, CheckoutPreviewDto, ConfirmImageDto } from './order.dto';

@Controller('user/order')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // ── POST routes ──

  @Post('checkout-preview')
  @Roles('user')
  checkoutPreview(@Body() dto: CheckoutPreviewDto) {
    return this.orderService.checkoutPreview(dto);
  }

  @Post('checkout')
  @Roles('user')
  checkout(@Req() req, @Body() dto: CheckoutDto) {
    const userId = req.user.uid;
    return this.orderService.checkout(userId, dto);
  }

  @Post("shipping-options")
  shipping_options(
    @Body() dto: CheckoutPreviewDto,
  ){
    return this.orderService.shippingOptions(dto);
  }

  // ── PATCH routes ──

  @Patch('image/:imageId/confirm')
  @Roles('user')
  confirmImage(
    @Req() req,
    @Param('imageId') imageId: string,
    @Body() dto: ConfirmImageDto,
  ) {
    const userId = req.user.uid;
    return this.orderService.confirmImage(userId, imageId, dto);
  }

  // ── GET routes (specific first, wildcard last) ──

  @Get()
  @Roles('user')
  findAllByUser(@Req() req) {
    const userId = req.user.uid;
    return this.orderService.findAllByUser(userId);
  }

  @Get(':id')
  @Roles('user')
  findOneByUser(@Req() req, @Param('id') id: string) {
    const userId = req.user.uid;
    return this.orderService.findOneByUser(userId, id);
  }
}
