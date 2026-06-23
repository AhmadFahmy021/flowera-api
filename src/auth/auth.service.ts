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
import { Admin } from '../database/entities/admin.entity';
import { Seller } from '../database/entities/seller.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
// import { StringValue } from 'ms';
import * as fs from 'fs';
import * as path from 'path';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    private config: ConfigService,
  ) {
    this.validateJwtKeys();
   }

  private validateJwtKeys() {
    const privateKey = path.join(
      process.cwd(),
      this.config.get<string>('JWT_ACCESS_PRIVATE_KEY')!,
    );

    const publicKey = path.join(
      process.cwd(),
      this.config.get<string>('JWT_ACCESS_PUBLIC_KEY')!,
    );

    if (!fs.existsSync(privateKey)) {
      throw new Error(`Private key tidak ditemukan: ${privateKey}`);
    }

    if (!fs.existsSync(publicKey)) {
      throw new Error(`Public key tidak ditemukan: ${publicKey}`);
    }
  }

  // ─── Register ───────────────────────────────────────────
  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOneBy({ email: dto.email });
    if (existing) throw new BadRequestException('Email sudah terdaftar');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      name: dto.name,
      phone_number: dto.phone_number,
      email: dto.email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    const tokens = await this.generateTokens(user.id, user.email, user.avatar);
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

    const tokens = await this.generateTokens(user.id, user.email, user.avatar);
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
    if (!user || !user.refreshToken) throw new ForbiddenException('Akses ditolak');

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new ForbiddenException('Refresh token tidak valid');

    // Generate token baru keduanya (access + refresh diperpanjang)
    const tokens = await this.generateTokens(user.id, user.email, user.avatar);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;  // kirim refresh token baru juga ke frontend
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


      user = this.userRepository.create({
        name: googleUser.name,
        email: googleUser.email,
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

    

    const tokens = await this.generateTokens(user.id, user.email, user.avatar);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  // ─── Helpers ────────────────────────────────────────────
  private getPrivateKey(): Buffer {
    return fs.readFileSync(
      path.join(
        process.cwd(),
        this.config.get('JWT_ACCESS_PRIVATE_KEY') as string,
      ),
    );
  }

  private generateAccessToken(
    userId: number,
    // email: string,
    avatar: string | undefined,
    roles: string[],
    privateKey: Buffer,
  ): string {
    return jwt.sign({ uid: userId, avatar, roles }, privateKey, {
      algorithm: 'RS256',
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES'),
    });
  }

  private generateRefreshToken(
    userId: number,
    // email: string,
    avatar: string | undefined,
    roles: string[],
    privateKey: Buffer,
  ): string {
    return jwt.sign({ uid: userId, avatar, roles }, privateKey, {
      algorithm: 'RS256',
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES'),
    });
  }

  private async generateTokens(userId: number, email: string, avatar: string | undefined) {
    const privateKey = this.getPrivateKey();

    const roles: string[] = [
      "user"
    ];


    const admin = await this.adminRepository.findOne({
      where: { user: { id: userId } },
    });
    if (admin) roles.push('admin');

    const seller = await this.sellerRepository.findOne({
      where: { user: { id: userId } },
    });
    if (seller) roles.push('seller');

    const accessToken = this.generateAccessToken(userId, avatar, roles, privateKey);
    const refreshToken = this.generateRefreshToken(userId, avatar, roles, privateKey);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { refreshToken: hashed });
  }

  async me(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const roles: string[] = ['user'];

    const admin = await this.adminRepository.findOne({
      where: { user: { id: userId } },
    });

    if (admin) roles.push('admin');

    const seller = await this.sellerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (seller) roles.push('seller');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      roles,
    };
  }
}
