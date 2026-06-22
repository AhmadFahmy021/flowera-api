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

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Seller) private sellerRepository: Repository<Seller>,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const requiredRoles =
      this.reflector.getAllAndOverride<
        string[]
      >(
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
            await this.sellerRepository.findOne({
              where: {
                user: {
                  id: user.uid,
                }
              },
            });

          if (seller) {
            user.sid = seller.id;
            return true;
          }

          break;
        }

        case 'admin': {
          if (
            user.roles?.includes(
              'admin',
            )
          ) {
            return true;
          }

          break;
        }

        case 'user': {
          return true;
        }
      }
    }

    return false;
  }
}