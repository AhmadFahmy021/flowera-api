import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['refreshToken'];
          }
          if (!token && req && req.headers && req.headers.cookie) {
            const match = req.headers.cookie.match(/(^| )refreshToken=([^;]+)/);
            if (match) token = match[2];
          }
          return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        },
      ]),
      secretOrKey: fs.readFileSync(
        path.join(
          process.cwd(),
          config.get('JWT_REFRESH_PUBLIC_KEY') as string,
        ),
      ),
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: { uid: number; email?: string; roles?: string[] }) {
    let refreshToken = null;
    if (req && req.cookies) {
      refreshToken = req.cookies['refreshToken'];
    }
    if (!refreshToken && req && req.headers && req.headers.cookie) {
      const match = req.headers.cookie.match(/(^| )refreshToken=([^;]+)/);
      if (match) refreshToken = match[2];
    }
    if (!refreshToken) {
      refreshToken = req.headers.authorization?.replace('Bearer ', '');
    }
    if (!refreshToken) throw new UnauthorizedException();
    return { id: payload.uid, email: payload.email, roles: payload.roles || [], refreshToken };
  }
}
