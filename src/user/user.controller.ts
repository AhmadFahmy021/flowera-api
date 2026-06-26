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
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import {
  UpdateProfileDto,
  CreateAddressDto,
  UpdateAddressDto,
} from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    const userId = req.user.uid;
    return this.userService.getProfile(userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    const userId = req.user.uid;
    return this.userService.updateProfile(userId, dto);
  }

  @Get('profile/addresses')
  @UseGuards(JwtAuthGuard)
  getAddresses(@Req() req) {
    const userId = req.user.uid;
    return this.userService.getAddresses(userId);
  }

  @Post('profile/addresses')
  @UseGuards(JwtAuthGuard)
  createAddress(@Req() req, @Body() dto: CreateAddressDto) {
    const userId = req.user.uid;
    return this.userService.createAddress(userId, dto);
  }

  @Patch('profile/addresses/:id')
  @UseGuards(JwtAuthGuard)
  updateAddress(
    @Req() req,
    @Param('id') id: number,
    @Body() dto: UpdateAddressDto,
  ) {
    const userId = req.user.uid;
    return this.userService.updateAddress(userId, id, dto);
  }

  @Delete('profile/addresses/:id')
  @UseGuards(JwtAuthGuard)
  deleteAddress(@Req() req, @Param('id') id: number) {
    const userId = req.user.uid;
    return this.userService.deleteAddress(userId, id);
  }
}
