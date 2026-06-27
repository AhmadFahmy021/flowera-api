import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from 'src/database/entities/seller.entity';
import { Admin } from 'src/database/entities/admin.entity';
import { RolesGuard } from './roles.guard';
import { RoleService } from './roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Seller,
      Admin,
    ]),
  ],
  providers: [RoleService, RolesGuard],
  exports: [RoleService, RolesGuard],
})
export class GuardsModule {}