import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AddressService } from './address.service';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';

import { AddressCreateDto, AddressUpdateDto} from './address.dto';

@Controller('user/address')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
  ) {}

  // Create Address
  @Post()
  @Roles('user')
  create(
    @Req() req,
    @Body() dto: AddressCreateDto,
  ) {
    const userId = req.user.uid;

    return this.addressService.create(userId, dto);
  }

  // Get All Addresses
  @Get()
  @Roles('user')
  findAll(@Req() req) {
    const userId = req.user.uid;

    return this.addressService.findAll(userId);
  }

  // Get Address By Id
  @Get(':id')
  @Roles('user')
  findOne(
    @Req() req,
    @Param('id') id: string,
  ) {
    const userId = req.user.uid;

    return this.addressService.findOne(userId, id);
  }

  // Update Address
  @Patch(':id')
  @Roles('user')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: AddressUpdateDto,
  ) {
    const userId = req.user.uid;

    return this.addressService.update(userId, id, dto);
  }

  // Delete Address
  @Delete(':id')
  @Roles('user')
  remove(
    @Req() req,
    @Param('id') id: string,
  ) {
    const userId = req.user.uid;

    return this.addressService.remove(userId, id);
  }
}