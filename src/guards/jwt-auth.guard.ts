import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
  ) {}

  private getPublicKey(): Buffer {
    const keyPath = path.join(
      process.cwd(),
      this.config.get<string>('JWT_ACCESS_PUBLIC_KEY')!,
    );

    if (!fs.existsSync(keyPath)) {
      throw new Error(
        `Public key tidak ditemukan: ${keyPath}`,
      );
    }

    return fs.readFileSync(keyPath);
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken =
      request.cookies?.accessToken;

    const refreshToken =
      request.cookies?.refreshToken;

    const publicKey = this.getPublicKey();

    // ==========================
    // ACCESS TOKEN
    // ==========================
    if (accessToken) {
      try {
        const payload = jwt.verify(
          accessToken,
          publicKey,
          {
            algorithms: ['RS256'],
          },
        );

        request.user = payload;

        return true;
      } catch (error) {
        // lanjut ke refresh token
      }
    }

    // ==========================
    // REFRESH TOKEN
    // ==========================
    if (refreshToken) {
      try {
        const payload = jwt.verify(
          refreshToken,
          publicKey,
          {
            algorithms: ['RS256'],
          },
        );

        request.user = payload;

        return true;
      } catch (error) {
        throw new UnauthorizedException(
          'Refresh token tidak valid',
        );
      }
    }

    throw new UnauthorizedException(
      'Session expired',
    );
  }
}