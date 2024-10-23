import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from '../../restaurant/schemas/restaurant.schema';

export type WaiterDocument = HydratedDocument<Waiter>;

@Schema({ versionKey: false })
export class Waiter {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  })
  restaurant_id: Restaurant;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  phone_number: string;

  @Prop()
  email: string;

  @Prop()
  address: string;

  @Prop()
  hired_date: string;
}

export const WaiterSchema = SchemaFactory.createForClass(Waiter);
