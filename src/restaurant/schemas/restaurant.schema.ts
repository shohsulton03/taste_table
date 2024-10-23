import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Tables } from '../../tables/schemas/table.schema';
import { Meneger } from '../../meneger/schemas/meneger.schema';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ versionKey: false })
export class Restaurant {
  @Prop()
  name: string;

  @Prop()
  phone_number: string;

  @Prop()
  description: string;

  //   ko'p munosabatda bog'lanish
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tables',
      },
    ],
  })
  tables: Tables[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
