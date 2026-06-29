import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminSellerService } from './seller.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { AdminCreateSellerDto, AdminUpdateSellerDto } from './seller.dto';

@Controller('admin/seller')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminSellerController {
  constructor(private readonly adminSellerService: AdminSellerService) {}

  @Get()
  findAll() {
    return this.adminSellerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminSellerService.findOne(id);
  }

  @Post('create')
  create(@Body() dto: AdminCreateSellerDto) {
    return this.adminSellerService.create(dto);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: AdminUpdateSellerDto) {
    return this.adminSellerService.update(id, dto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.adminSellerService.remove(id);
  }
}
