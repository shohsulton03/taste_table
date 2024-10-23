export class CreatePaymentDto {
  reservation_id: string;
  order_detail_id: string;
  client_id: string;
  payment_date: string;
  amout: number;
  payment_method: string;
}
