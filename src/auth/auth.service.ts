import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
// import { StringValue } from 'ms';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private config: ConfigService,
  ) {}

  // ─── Register ───────────────────────────────────────────
  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOneBy({ email: dto.email });
    if (existing) throw new BadRequestException('Email sudah terdaftar');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      name: dto.name,
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  // ─── Login ──────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) throw new UnauthorizedException('Email atau password salah');
    if (!user.password)
      throw new UnauthorizedException('Akun ini menggunakan login Google');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Email atau password salah');

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  // ─── Logout ─────────────────────────────────────────────
  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: undefined });
    return { message: 'Logout berhasil' };
  }

  // ─── Refresh Token ──────────────────────────────────────
  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Akses ditolak');

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new ForbiddenException('Refresh token tidak valid');

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  // ─── Change Password ────────────────────────────────────
  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !user.password)
      throw new BadRequestException('User tidak ditemukan');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Password lama salah');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.update(userId, { password: hashed });
    return { message: 'Password berhasil diubah' };
  }

  // ─── Google OAuth ───────────────────────────────────────
  async googleLogin(googleUser: {
    googleId: string;
    name: string;
    email: string;
    avatar: string;
  }) {
    let user = await this.userRepository.findOneBy({ email: googleUser.email });

    if (!user) {
      const emailPrefix = googleUser.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      let username = emailPrefix;
      let isUnique = false;
      let attempts = 0;

      while (!isUnique && attempts < 10) {
        const existingUsername = await this.userRepository.findOneBy({ username });
        if (!existingUsername) {
          isUnique = true;
        } else {
          username = `${emailPrefix}${Math.floor(100 + Math.random() * 900)}`;
          attempts++;
        }
      }

      if (!isUnique) {
        username = `${emailPrefix}${Date.now().toString().slice(-4)}`;
      }

      user = this.userRepository.create({
        name: googleUser.name,
        email: googleUser.email,
        username,
        googleId: googleUser.googleId,
        avatar: googleUser.avatar,
      });
      await this.userRepository.save(user);
    } else if (!user.googleId) {
      await this.userRepository.update(user.id, {
        googleId: googleUser.googleId,
        avatar: googleUser.avatar,
      });
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  // ─── Helpers ────────────────────────────────────────────
  private generateTokens(userId: number, email: string) {
    const privateKey = fs.readFileSync(
      path.join(
        process.cwd(),
        this.config.get('JWT_ACCESS_PRIVATE_KEY') as string,
      ),
    );

    const accessToken = jwt.sign({ sub: userId, email }, privateKey, {
      algorithm: 'RS256',
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES'),
    });

    const refreshToken = jwt.sign({ sub: userId, email }, privateKey, {
      algorithm: 'RS256',
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES'),
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { refreshToken: hashed });
  }
}
