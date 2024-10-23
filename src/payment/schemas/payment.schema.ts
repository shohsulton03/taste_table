import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Reservation } from '../../reservation/schemas/reservation.schema';
import { Client } from '../../client/schemas/client.schema';
import { OrderDetail } from '../../order_detail/schemas/order_detail.schema';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ versionKey: false })
export class Payment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
  })
  reservation_id: Reservation;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderDetail'
  })
  order_detail_id: OrderDetail;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  })
  client_id: Client;

  @Prop()
  payment_date: string;

  @Prop()
  amout: number;

  @Prop()
  payment_method: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
