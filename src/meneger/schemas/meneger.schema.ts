import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from '../../restaurant/schemas/restaurant.schema';

export type MenegerDocument = HydratedDocument<Meneger>;

@Schema({ versionKey: false })
export class Meneger {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  })
  restaurant_id: Restaurant;

  @Prop()
  full_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone_number: string;

  @Prop()
  tg_link: string;

  @Prop()
  hashed_password: string;

  @Prop()
  hashed_refresh_token: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop()
  description: string;

  @Prop()
  activation_link: string;

  @Prop()
  url: string;
}

export const MenegerSchema = SchemaFactory.createForClass(Meneger);
