import { Module } from '@nestjs/common';
import { AdminUserService } from './user.service';
import { AdminUserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { GuardsModule } from 'src/guards/guards.module';

@Module({
  controllers: [AdminUserController],
  providers: [AdminUserService],
  imports: [TypeOrmModule.forFeature([User]), GuardsModule],
})
export class AdminUserModule {}
