import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express'; // ✅ import biasa sudah cukup
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { GoogleGuard } from '../guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: any) {
    return this.authService.logout(req.user.id);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() req: any) {
    return this.authService.refreshToken(req.user.id, req.user.refreshToken);
  }

  @Post('change-password')
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  googleCallback(@Req() req: any) {
    return this.authService.googleLogin(req.user);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  googleAuth() {}

  // @Get('google/callback')
  // @UseGuards(GoogleGuard)
  // googleCallback(@Req() req: Request) {
  //   return this.authService.googleLogin(req.user as any);
  // }
}
