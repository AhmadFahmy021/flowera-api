import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: fs.readFileSync(
        path.join(process.cwd(), config.get('JWT_ACCESS_PUBLIC_KEY') as string),
      ),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: { sub: number; email: string }) {
    if (!payload) throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email };
  }
}
