export interface MidtransChargeRequest {
  payment_type: 'qris';

  transaction_details: {
    order_id: string;
    gross_amount: number;
  };

  qris: {
    acquirer: 'gopay';
  };

  customer_details?: {
    first_name: string;
    email: string;
    phone: string;
  };

  item_details?: {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }[];
}