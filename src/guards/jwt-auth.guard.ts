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

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies.accessToken;
    

    if (!token) {
        throw new UnauthorizedException(
        'Access token tidak ditemukan',
        );
    }

    try {
        const payload = jwt.verify(
        token,
        this.getPublicKey(),
        {
            algorithms: ['RS256'],
        },
        );

        request.user = payload;

        return true;
    } catch (error) {
        throw new UnauthorizedException(
        'Token tidak valid',
        );
    }
    }
}