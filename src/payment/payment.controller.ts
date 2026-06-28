import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, MidtransWebhookDto } from './payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("qris")
    async createQRIS(
        @Body() dto:CreatePaymentDto
    ){
        return this.paymentService.createQRIS(dto);
    }

  @Get("status/:orderNumber")
  async status(
      @Param("orderNumber") orderNumber: string,
  ) {
      return this.paymentService.checkStatus(orderNumber);
  }

  @Post("webhook")
  @HttpCode(200)
  async webhook(

      @Body() body: MidtransWebhookDto,

  ) {

      return this.paymentService.webhook(body);

  }
}
