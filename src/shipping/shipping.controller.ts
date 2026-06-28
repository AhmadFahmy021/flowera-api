import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';

@Controller('user/shipping')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('destinations')
  @Roles('user')
  async getDestinations(
    @Query('search') search: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    const data = await this.shippingService.searchDestinations(search, limitNum, offsetNum);
    return {
      meta: {
        message: 'Success Get Domestic Destinations',
        code: 200,
        status: 'success',
      },
      data,
    };
  }

  @Get('cost')
  @Roles('user')
  async getCost(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
    @Query('weight') weight: string,
    @Query('courier') courier: string,
    @Query('price') price?: string,
  ) {
    const weightNum = weight ? parseInt(weight, 10) : 1000;
    const data = await this.shippingService.calculateCost(
      origin,
      destination,
      weightNum,
      courier,
      price,
    );
    return {
      meta: {
        message: 'Success Calculate Domestic Shipping cost',
        code: 200,
        status: 'success',
      },
      data,
    };
  }

  @Post('cost')
  @Roles('user')
  async postCost(
    @Body('origin') origin: string,
    @Body('destination') destination: string,
    @Body('weight') weight: string,
    @Body('courier') courier: string,
    @Body('price') price?: string,
  ) {
    const weightNum = weight ? parseInt(weight, 10) : 1000;
    const data = await this.shippingService.calculateCost(
      origin,
      destination,
      weightNum,
      courier,
      price,
    );
    return {
      meta: {
        message: 'Success Calculate Domestic Shipping cost',
        code: 200,
        status: 'success',
      },
      data,
    };
  }
}
