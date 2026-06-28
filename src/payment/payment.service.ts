import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { CreatePaymentDto, MidtransWebhookDto } from './payment.dto';

import {
  MidtransChargeRequest,
} from './interfaces/charge-request.interface';

import {
  MidtransChargeResponse,
} from './interfaces/charge-response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentOrder } from 'src/database/entities/payment-order.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/database/entities/order.entity';
import * as crypto from "crypto";
import { OrderItem } from 'src/database/entities/order-item.entity';

@Injectable()
export class PaymentService {

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(PaymentOrder) private readonly paymentOrderRepository: Repository<PaymentOrder>,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>
  ) {}

  async createQRIS(
    dto: CreatePaymentDto,
  ): Promise<MidtransChargeResponse> {

    const payload: MidtransChargeRequest = {

      payment_type: 'qris',

      transaction_details: {
        order_id: dto.order_id,
        gross_amount: dto.gross_amount,
      },

      qris: {
        acquirer: 'gopay',
      },

      customer_details: {
        first_name: dto.customer_name,
        email: dto.customer_email,
        phone: dto.customer_phone,
      },

      item_details: dto.items.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })),
    };
    console.log(payload);
    
    const serverKey =
      this.config.get<string>('MIDTRANS_SERVER_KEY');

    const baseUrl =
      this.config.get<string>('MIDTRANS_BASE_URL');

    const response = await fetch(
      `${baseUrl}/v2/charge`,
      {

        method: 'POST',

        headers: {

          Authorization:
            `Basic ${Buffer.from(serverKey + ':').toString('base64')}`,

          'Content-Type':
            'application/json',

          Accept:
            'application/json',
        },

        body:
          JSON.stringify(payload),

      },
    );

    const result =
      await response.json();

    if (!response.ok) {

      throw new InternalServerErrorException(result);

    }

    return result;

  }

  private async syncPaymentFromMidtrans(
        payment: PaymentOrder,
    ){

        const serverKey =
            this.config.get<string>("MIDTRANS_SERVER_KEY");

        const baseUrl =
            this.config.get<string>("MIDTRANS_BASE_URL");

        const response =
            await fetch(

                `${baseUrl}/v2/${payment.reference_id}/status`,

                {

                    headers:{

                        Authorization:
                            "Basic " +
                            Buffer.from(
                                serverKey + ":",
                            ).toString("base64"),

                    },

                },

            );

        const midtrans =
            await response.json();

        await this.syncPaymentStatus(

            payment,

            midtrans.transaction_status,

            midtrans,

            midtrans.settlement_time,

        );

    }

  private async syncPaymentStatus(
    payment: PaymentOrder,
    transactionStatus: string,
    payload: any,
    settlementTime?: string,
    ) {

    payment.status = transactionStatus;

    payment.payment_response = JSON.stringify(payload);

    if (settlementTime) {
        payment.payment_time = new Date(settlementTime);
    }

    switch (transactionStatus) {

        case "capture":
        case "settlement":

        payment.order_id.status = "PAID";
        break;

        case "pending":

        payment.order_id.status = "UNPAID";
        break;

        case "expire":

        payment.order_id.status = "EXPIRED";
        break;

        case "cancel":

        payment.order_id.status = "CANCELLED";
        break;

        case "deny":

        payment.order_id.status = "FAILED";
        break;
    }
    
    await this.paymentOrderRepository.save(payment);

    await this.orderRepository.save(payment.order_id);

    return payment;
    }

  async checkStatus(orderNumber: string) {

        const payment =
            await this.paymentOrderRepository.findOne({

                where:{

                    order_id:{

                        orderNumber,

                    }

                },

                relations:["order_id"]

            });

        if(!payment){

            throw new NotFoundException();

        }

        const serverKey =
            this.config.get<string>('MIDTRANS_SERVER_KEY');

        const baseUrl =
            this.config.get<string>('MIDTRANS_BASE_URL');

        const response = await fetch(

            `${baseUrl}/v2/${orderNumber}/status`,

            {

                method:"GET",

                headers:{

                    Authorization:
                        "Basic " +
                        Buffer.from(serverKey + ":").toString("base64"),

                }

            }

        );

        const midtrans = await response.json();

        await this.syncPaymentStatus(

            payment,

            midtrans.transaction_status,

            midtrans,

            midtrans.settlement_time,

        );

        return {

            status:"success",

            data:{

                payment_status:payment.status,

                order_status:payment.order_id.status,

                qr_url:payment.payment_url,

                expired_at:payment.expired_payment_time,

            }

        };

    }

    private verifySignature(body: MidtransWebhookDto) {

        const serverKey =
            this.config.get<string>("MIDTRANS_SERVER_KEY");

        const hash = crypto
            .createHash("sha512")
            .update(

                body.order_id +
                body.status_code +
                body.gross_amount +
                serverKey,

            )
            .digest("hex");

        return hash === body.signature_key;

    }

    async webhook(body: MidtransWebhookDto) {

        if(!this.verifySignature(body)){

            throw new UnauthorizedException();

        }

        const payment =
            await this.paymentOrderRepository.findOne({

                where:{

                    reference_id:body.order_id,

                },

                relations:["order_id"]

            });

        if(!payment){

            throw new NotFoundException();

        }

        await this.syncPaymentStatus(

            payment,

            body.transaction_status,

            body,

            body.settlement_time,

        );

        return{

            status:"success"

        };

    }

    async syncPendingPayments() {

        const payments =
            await this.paymentOrderRepository.find({

                where:{

                    status:"pending",

                },

                relations:["order_id"],

            });

        console.log(

            `Found ${payments.length} pending payments`

        );

        for(const payment of payments){

            try{

                await this.syncPaymentFromMidtrans(

                    payment,

                );

            } catch(error){

                console.error(

                    payment.reference_id,

                    error.message

                );

            }

        }

    }

}