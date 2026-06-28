import { IsArray, IsEmail, IsNumber, IsString } from 'class-validator';

export class MidtransItemDto{

    @IsString()
    id!:string;

    @IsString()
    name!:string;

    @IsNumber()
    price!:number;

    @IsNumber()
    quantity!:number;
}

export class CreatePaymentDto{

    @IsString()
    order_id!:string;

    @IsNumber()
    gross_amount!:number;

    @IsString()
    customer_name!:string;

    @IsEmail()
    customer_email!:string;

    @IsString()
    customer_phone!:string;

    @IsArray()
    items!:MidtransItemDto[];
}

export class MidtransWebhookDto {
  transaction_time!: string;
  transaction_status!: string;
  transaction_id!: string;
  status_message!: string;
  status_code!: string;

  signature_key!: string;

  payment_type!: string;

  order_id!: string;

  merchant_id!: string;

  gross_amount!: string;

  fraud_status?: string;

  currency?: string;

  settlement_time?: string;

  expiry_time?: string;

  issuer?: string;

  acquirer?: string;
}
