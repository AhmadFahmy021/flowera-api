import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';

import { ProfileUpdateDto } from './profile.dto';

@Controller('user/profile')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  @Get('detail')
  @Roles('user')
  detail(@Req() req) {
    const userId = req.user.uid;

    return this.profileService.detail(userId);
  }

  @Put('update')
  @Roles('user')
  update(
    @Req() req,
    @Body() dto: ProfileUpdateDto,
  ) {
    const userId = req.user.uid;

    return this.profileService.update(userId, dto);
  }
}