import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from '../../restaurant/schemas/restaurant.schema';
import { Client } from '../../client/schemas/client.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ versionKey: false })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  })
  client_id: Client;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  })
  restaurant_id: Restaurant;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
