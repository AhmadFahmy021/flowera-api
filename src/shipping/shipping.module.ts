import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { GuardsModule } from 'src/guards/guards.module';

@Module({
  controllers: [ShippingController],
  providers: [ShippingService],
  imports: [GuardsModule],
  exports: [ShippingService],
})
export class ShippingModule {}
