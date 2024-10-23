import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Order } from '../../order/schemas/order.schema';
import { Menu } from '../../menu/schemas/menu.schema';
import { Waiter } from '../../waiter/schemas/waiter.schema';

export type OrderDetailDocument = HydratedDocument<OrderDetail>;

@Schema({ versionKey: false })
export class OrderDetail {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  })
  order_id: Order;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
  })
  menu_id: Menu;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Waiter',
  })
  waiter_id: Waiter;

  @Prop()
  total_price: number;

  @Prop()
  order_status: string;

  @Prop()
  creted_at: string;

  @Prop()
  payment_status: string;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
