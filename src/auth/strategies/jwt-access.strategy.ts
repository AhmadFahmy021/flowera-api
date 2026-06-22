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
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['accessToken'];
          }
          if (!token && req && req.headers && req.headers.cookie) {
            const match = req.headers.cookie.match(/(^| )accessToken=([^;]+)/);
            if (match) token = match[2];
          }
          return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        },
      ]),
      secretOrKey: fs.readFileSync(
        path.join(process.cwd(), config.get('JWT_ACCESS_PUBLIC_KEY') as string),
      ),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: { uid: number; email?: string; roles?: string[] }) {
    if (!payload) throw new UnauthorizedException();
    return { id: payload.uid, email: payload.email, roles: payload.roles || [] };
  }
}
