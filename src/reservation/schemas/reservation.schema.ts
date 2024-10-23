import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Tables } from '../../tables/schemas/table.schema';
import { Client } from '../../client/schemas/client.schema';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({ versionKey: false })
export class Reservation {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tables',
  })
  table_id: Tables;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  })
  client_id: Client;

  @Prop()
  reservation_date: string;

  @Prop()
  reservation_time: string;

  @Prop()
  status: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
