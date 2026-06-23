import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { GoogleGuard } from '../guards/google.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getCookieOptions(
    maxAge: number,
  ): express.CookieOptions {
    return {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        'production',
      sameSite: 'lax',
      maxAge,
    };
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const tokens = await this.authService.register(dto);
    res.cookie('accessToken', tokens.accessToken, this.getCookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', tokens.refreshToken,this.getCookieOptions(100 * 24 * 60 * 60 * 1000));
    return {
      status: "success",
      message: "Account has been successfully registered",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const tokens = await this.authService.login(dto);
    res.cookie('accessToken', tokens.accessToken, this.getCookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', tokens.refreshToken,this.getCookieOptions(100 * 24 * 60 * 60 * 1000));
    return {
      status: "success",
      message: "You have successfully logged in",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return this.authService.logout(req.user.uid);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const refreshToken =
      req.cookies.refreshToken;

    const tokens =
      await this.authService.refreshToken(
        req.user.uid,
        refreshToken,
      );
    res.cookie('accessToken', tokens.accessToken, this.getCookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', tokens.refreshToken,this.getCookieOptions(100 * 24 * 60 * 60 * 1000));
    return tokens;
  }

  @Post('change-password')
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const tokens = await this.authService.googleLogin(req.user);
    res.cookie('accessToken', tokens.accessToken, this.getCookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', tokens.refreshToken,this.getCookieOptions(100 * 24 * 60 * 60 * 1000));
    return res.redirect('http://localhost:3001');
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  googleAuth() {}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    return this.authService.me(req.user.uid);
  }
}
