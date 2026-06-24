import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { ProducCategories } from 'src/database/entities/prouct-categories.entity';
import { Product } from 'src/database/entities/product.entity';
import { Store } from 'src/database/entities/store.entity';

@Module({
  controllers: [HomeController],
  providers: [HomeService],
  imports: [
    TypeOrmModule.forFeature([ProducCategories, Product, Store])
  ]
})
export class HomeModule {}
