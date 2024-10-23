import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Tables } from '../../tables/schemas/table.schema';
import { Restaurant } from '../../restaurant/schemas/restaurant.schema';
import { Category } from '../../category/schemas/category.schema';
import { Language } from '../../language/schemas/language.schema';
import { Field, ID, ObjectType } from '@nestjs/graphql';

export type MenuDocument = HydratedDocument<Menu>;

@ObjectType()
@Schema({ versionKey: false })
export class Menu {
  @Field(() => ID)
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  })
  category_id: Category;

  // @Field()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  })
  restaurant_id: Restaurant;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  description: string;

  @Field()
  @Prop()
  price: string;

  @Field()
  @Prop()
  image_url: string;

  @Field()
  @Prop()
  status: string;

  //   @Prop({
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Language',
  //   })
  //   language_id: Language;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
