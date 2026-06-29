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
import { AdminUserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { AdminCreateUserDto, AdminUpdateUserDto } from './user.dto';

@Controller('admin/user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  findAll() {
    return this.adminUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminUserService.findOne(id);
  }

  @Post('create')
  create(@Body() dto: AdminCreateUserDto) {
    return this.adminUserService.create(dto);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.adminUserService.update(id, dto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.adminUserService.remove(id);
  }
}
