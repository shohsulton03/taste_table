import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from '../../restaurant/schemas/restaurant.schema';

export type LanguageDocument = HydratedDocument<Language>;

@Schema({ versionKey: false })
export class Language {
  @Prop()
  language_code: string;

  @Prop()
  language_name: string;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
