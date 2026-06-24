import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HomeModule } from './home/home.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [HomeModule],
})
export class UserModule {}
