import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>;

@Schema({ versionKey: false })
export class Client {
  @Prop()
  username: string;

  @Prop()
  phone_number: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  hashed_password: string;

  @Prop()
  hashed_refresh_token: string;

  @Prop()
  language_preference: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop()
  activation_link: string;

  @Prop()
  url: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
