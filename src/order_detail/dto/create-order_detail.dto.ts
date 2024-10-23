export class CreateOrderDetailDto {
  order_id: string;
  menu_id: string;
  waiter_id: string;
  total_price: number;
  order_status: string;
  creted_at: string;
  payment_status: string;
}
