import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from 'src/database/entities/seller.entity';
import { Admin } from 'src/database/entities/admin.entity';
import { RoleService } from './roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!requiredRoles?.length) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      return false;
    }

    for (const role of requiredRoles) {
      switch (role.toLowerCase()) {

        case 'seller': {
          const seller =
            await this.roleService.isSeller(
              user.uid,
            );

          if (seller) {
            user.sid = seller.id;
            return true;
          }

          break;
        }

        case 'admin': {
          const admin =
            await this.roleService.isAdmin(
              user.uid,
            );

          if (admin) {
            user.aid = admin.id;
            return true;
          }

          break;
        }

        case 'user':
          return true;
      }
    }

    return false;
  }
}