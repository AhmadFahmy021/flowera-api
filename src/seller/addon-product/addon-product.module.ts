import { Module } from '@nestjs/common';
import { AddonProductService } from './addon-product.service';
import { AddonProductController } from './addon-product.controller';

@Module({
  controllers: [AddonProductController],
  providers: [AddonProductService],
})
export class AddonProductModule {}
